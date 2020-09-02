package main

import (
	"io"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var hub *Hub

func main() {
	hub = NewHub()

	http.HandleFunc("/hello", helloHandler)
	http.Handle("/", http.FileServer(http.Dir("assets")))

	http.HandleFunc("/chatws", chatHandler)
	log.Fatal(http.ListenAndServeTLS(":8443", "cert.pem", "key.pem", nil))
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "Hello, world!\n")
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func chatHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	hub.AddComm(conn)
}
