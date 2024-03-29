import { Message } from "../Message";

const inp = document.getElementById('input-text') as HTMLInputElement;
const out = document.getElementById('output-text') as HTMLTextAreaElement;
const onl = document.getElementById('online-list') as HTMLTextAreaElement;
const buttons = document.querySelectorAll("div > div") as NodeListOf<HTMLDivElement>;

let socket = new WebSocket("wss://" + document.location.host + '/');
socket.addEventListener("message", receiveMessage);

socket.addEventListener("error", () => {
  console.warn("Secure socket connection failed. Trying insecure.");
  socket = new WebSocket("ws://" + document.location.host + '/');
  socket.addEventListener("message", receiveMessage);
  out.textContent += "Warning: Connected to websocket server insecurely.\n";
});

let onlineUsers: Set<string> = new Set();

let loggedIn = false;

function receiveMessage(event: MessageEvent<string>) {
  const msg: Message = JSON.parse(event.data);
  if (msg.type === 'chat') {
    out.textContent += `${msg.message}\n`;
    out.scrollTop = out.scrollHeight;
  } else if (msg.type === 'online') {
    onlineUsers = new Set(msg.users);
    onl.textContent = "Online Users: \n" + Array.from(onlineUsers).sort().join('\n');
    loggedIn = true;
  } else if (msg.type === 'login') {
    onlineUsers.add(msg.name);
    Array.from(onlineUsers).sort().join('\n');
    onl.textContent = Array.from(onlineUsers).sort().join('\n');
    out.textContent += `${msg.name} has logged in.\n`;
    out.scrollTop = out.scrollHeight;
  } else if (msg.type === 'logout') {
    onlineUsers.delete(msg.name);
    Array.from(onlineUsers).sort().join('\n');
    onl.textContent = Array.from(onlineUsers).sort().join('\n');
    out.textContent += `${msg.name} has logged out.\n`;
    out.scrollTop = out.scrollHeight;
  }
}

function sendMessage(msg: Message) {
  socket.send(JSON.stringify(msg));
}

inp.addEventListener('keypress', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    if (loggedIn) {
      sendMessage({ type: "chat", message: inp.value.trim() });
    } else {
      sendMessage({ type: "login", name: inp.value.trim() });
    }
    inp.value = '';
    return false;
  }
  return true;
});

buttons.forEach((v) => {
  v.addEventListener('click', (event) => {
    event.preventDefault();
    return false;
  });
});
