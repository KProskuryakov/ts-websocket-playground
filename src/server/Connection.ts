import WebSocket from "ws";
import { Message } from "../Message";

export class ConnectionSet {
  private online: Set<Connection>;
  private connecting: Set<Connection>;
  private names: Set<string>;

  constructor() {
    this.online = new Set();
    this.connecting = new Set();
    this.names = new Set();
  }

  nameList() {
    return Array.from(this.names);
  }

  uniqueName(name: string) {
    return !this.names.has(name);
  }

  sendChat(chat: string) {
    this.online.forEach((c) => {
      c.sendChat(chat);
    });
  }

  sendLogin(name: string) {
    this.online.forEach((c) => {
      c.sendLogin(name);
    });
  }

  sendLogout(name: string) {
    this.online.forEach((c) => {
      c.sendLogout(name);
    })
  }

  promote(conn: Connection) {
    if (this.connecting.has(conn) && conn.name) {
      this.connecting.delete(conn);
      this.online.add(conn);
      this.names.add(conn.name);
      this.sendLogin(conn.name);
      this.sendChat(`${conn.name} has logged in.`);
    }
  }

  addConnection(ws: WebSocket) {
    const conn = new Connection(ws, this);
    this.connecting.add(conn);
    conn.sendChat("Type your name to sign in to chat.");
    ws.on('message', (data) => {
      conn.receiveFromClient(JSON.parse(data.toString()));
    });
    ws.on('close', () => {
      this.online.delete(conn);
      this.connecting.delete(conn);
      if (conn.name) {
        this.names.delete(conn.name);
        this.sendLogout(conn.name);
        this.sendChat(`${conn.name} has logged out.`);
      }
    });
  }
}

export class Connection {
  private ws: WebSocket;
  private _name: string | undefined;
  private state: "connecting" | "connected";
  private cs: ConnectionSet;

  constructor(ws: WebSocket, cs: ConnectionSet) {
    this.ws = ws;
    this.state = "connecting";
    this.cs = cs;
  }

  get name() {
    return this._name;
  }

  sendMessage(message: Message) {
    this.ws.send(JSON.stringify(message));
  }

  sendChat(chat: string) {
    this.sendMessage({type: "chat", message: chat})
  }

  sendLogin(name: string) {
    this.sendMessage({type: "login", name: name});
  }

  sendLogout(name: string) {
    this.sendMessage({type: "logout", name: name});
  }

  sendOnlineList() {
    this.sendMessage({type: "online", users: this.cs.nameList()})
  }

  receiveFromClient(msg: Message) {
    console.log(`Received: ${msg.type}`);
    if (msg.type === 'chat' && this.name) {
      this.cs.sendChat(`${this.name}: ${msg.message}`);
    } else if (msg.type === 'login') {
      this.connect(msg.name);
    }
  }

  connect(name: string) {
    if (this.state === "connecting") {
      if (this.cs.uniqueName(name)) {
        this._name = name;
        this.state = "connected";
        this.cs.promote(this);
        this.sendOnlineList();
      } else {
        this.sendChat("Please pick a different name.");
      }
    }
  }

}