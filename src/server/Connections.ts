import WebSocket from "ws";
import { Character, newCharacter } from "../Character";
import { ChatMessage, LoginOutMessage, Message } from "../Message";

const users = new Map<WebSocket, User>();
const names = new Set<string>();
const alive = new Map<WebSocket, boolean>();

interface User {
  name: string;
  character: Character;
}

export function connect(ws: WebSocket) {
  alive.set(ws, true);
  sendMessage(ws, {type: "chat", message: "Type your name to log in."})

  ws.on("message", function(data) {
    const message: Message = JSON.parse(data.toString());

    if (message.type == "login" && !users.has(ws)) {
      promote(ws, message);
    } else if (message.type == "chat" && users.has(ws)) {
      chat(ws, message);
    }
  });

  ws.on("pong", function() {
    alive.set(ws, true);
  });

  ws.on("close", function() {
    close(ws);
  });
}

function promote(ws: WebSocket, message: LoginOutMessage) {
  let name = message.name.trim().slice(0, 16);
  if (name.length == 0 || names.has(name)) {
    sendMessage(ws, {type: "chat", message: "Please pick a different name."});
    return;
  }
  const user: User = {
    name,
    character: newCharacter(name)
  }
  users.set(ws, user);
  names.add(name);
  broadcast({type: "login", name: name});
  sendMessage(ws, {type: "online", users: Array.from(names)});
  sendMessage(ws, {type: "character", character: user.character});
}

function chat(ws: WebSocket, message: ChatMessage) {
  const chat = message.message.trim();
  if (chat.length > 0 && chat.length < 500) {
    broadcast({type: "chat", message: `${users.get(ws)!.name}: ${chat}`})
  }
}

function sendMessage(ws: WebSocket, message: Message) {
  ws.send(JSON.stringify(message));
}

function broadcast(message: Message) {
  for (let ws of users.keys()) {
    sendMessage(ws, message);
  }
}

function close(ws: WebSocket) {
  alive.delete(ws);
  if (users.has(ws)) {
    let user = users.get(ws)!;
    names.delete(user.name);
    users.delete(ws);
    broadcast({type: "logout", name: user.name});
  }
}

setInterval(() => {
  alive.forEach((a, ws) => {
    if (a === false) {
      return ws.terminate();
    }

    alive.set(ws, false);
    ws.ping();
  });
}, 30000);