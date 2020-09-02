package main

import (
	"log"

	"github.com/gorilla/websocket"
)

type Hub struct {
	broadcast chan Message
	closeComm chan *Comm
	comms     map[*Comm]bool
}

func NewHub() *Hub {
	hub := &Hub{broadcast: make(chan Message), comms: make(map[*Comm]bool), closeComm: make(chan *Comm)}
	go func() {
		for {
			select {
			case message := <-hub.broadcast:
				for comm := range hub.comms {
					comm.send <- message
				}
			case comm := <-hub.closeComm:
				delete(hub.comms, comm)
				close(comm.send)
				comm.conn.Close()
			}
		}
	}()
	return hub
}

func (hub *Hub) AddComm(conn *websocket.Conn) {
	comm := &Comm{conn, make(chan Message)}
	go func() {
		for {
			messageType, p, err := conn.ReadMessage()
			if err != nil {
				log.Println(err)
				hub.closeComm <- comm
				break
			}
			hub.broadcast <- Message{messageType, p}
		}
	}()
	go func() {
		for message := range comm.send {
			if err := conn.WriteMessage(message.messageType, message.p); err != nil {
				log.Println(err)
			}
		}
	}()
	hub.comms[comm] = true
}

type Comm struct {
	conn *websocket.Conn
	send chan Message
}

type Message struct {
	messageType int
	p           []byte
}
