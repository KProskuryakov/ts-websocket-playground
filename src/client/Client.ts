import { Message } from "../Message";

// let socket = new WebSocket('wss://' + document.location.host + '/');
let socket = new WebSocket('ws://' + document.location.host + '/');

let inp = document.getElementById('input-text') as HTMLTextAreaElement;
let out = document.getElementById('output-text') as HTMLTextAreaElement;
let onl = document.getElementById('online-list') as HTMLTextAreaElement;

let onlineUsers: Set<string> = new Set();

let loggedIn = false;

socket.onmessage = (event) => {
  let msg: Message = JSON.parse(event.data);
  if (msg.type === 'chat') {
    out.textContent += `${msg.message}\n`;
  } else if (msg.type === 'online') {
    onlineUsers = new Set(msg.users);
    onl.textContent = Array.from(onlineUsers).sort().join('\n');
    loggedIn = true;
  } else if (msg.type === 'login') {
    onlineUsers.add(msg.name);
    Array.from(onlineUsers).sort().join('\n');
    onl.textContent = Array.from(onlineUsers).sort().join('\n');
  } else if (msg.type === 'logout') {
    onlineUsers.delete(msg.name);
    Array.from(onlineUsers).sort().join('\n');
    onl.textContent = Array.from(onlineUsers).sort().join('\n');
  }
}

function sendMessage(msg: Message) {
  socket.send(JSON.stringify(msg));
}

inp.addEventListener('keypress', (event) => {
  if (event.key == 'Enter' && !event.shiftKey) {

    //Stops enter from creating a new line 
    event.preventDefault();
    const textbox = event.target as HTMLTextAreaElement;
    if (loggedIn) {
      sendMessage({type: "chat", message: textbox.value.trim()});
    } else {
      sendMessage(({type: "login", name: textbox.value.trim()}));
    }
    textbox.value = '';
    return true;
  }
  return false;
});
