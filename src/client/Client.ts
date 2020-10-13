// let socket = new WebSocket('wss://' + document.location.host + '/');
let socket = new WebSocket('ws://' + document.location.host + '/');

let inp = document.getElementById('input-text') as HTMLTextAreaElement;
let out = document.getElementById('output-text') as HTMLTextAreaElement;

socket.onmessage = (event) => {
  out.value += event.data;
}

inp.addEventListener('keypress', (event) => {
  if (event.key == 'Enter' && !event.shiftKey) {

    //Stops enter from creating a new line 
    event.preventDefault();
    const textbox = event.target as HTMLTextAreaElement;
    socket.send(textbox.value + '\n')
    textbox.value = '';
    return true;
  }
  return false;
});
