const socket=io();
var audio = new Audio();
audio.src = "sms_tone.mp3";
let time='';
setInterval(function(){ 
    time=new Date().toLocaleTimeString();
    }, 200);
const form=document.querySelector('#Form-Msg-Sender');
const msginput=document.querySelector('#msg');
const msgContainer=document.querySelector('.container');

const name=prompt("Enter your name to join the chat");
if(name==='')
{
    alert("plase enter valid name!");
    location.reload();
}
socket.emit('new-user',name);

const append=(msg)=>{
    const newDiv=document.createElement('div')
    newDiv.classList.add('newjoindiv');
    const newSpan=document.createElement('span');
    newSpan.textContent=msg;
    newSpan.classList.add('newjoin');
    newDiv.appendChild(newSpan);
    msgContainer.appendChild(newDiv);
    setTimeout(function(){ 
    newDiv.remove();
    }, 3000);

}

const leftAppend=(data)=>{
let br=document.createElement('br');
let msgDiv=document.createElement('div');
msgDiv.classList.add('message-left');
let userName=document.createElement('span');
userName.classList.add('user-name');
let msgCell=document.createElement('span');
msgCell.classList.add('msg-cell');
userName.textContent=data.name+':';
msgCell.textContent=data.message;
let em=document.createElement('em');
em.classList.add('curr-time');
em.textContent=time;
msgCell.appendChild(em);
msgDiv.appendChild(userName);
msgDiv.appendChild(br);
msgDiv.appendChild(msgCell);

msgContainer.append(msgDiv);
msgContainer.scrollTop = msgContainer.scrollHeight;
}
const rightAppend=(message)=>{
    let br=document.createElement('br');
    let msgDiv=document.createElement('div');
    msgDiv.classList.add('message-right');
    let userName=document.createElement('span');
    userName.classList.add('user-name');
    let msgCell=document.createElement('span');
    msgCell.classList.add('msg-cell');
    userName.textContent='You:';
    msgCell.textContent=message;
    let em=document.createElement('em');
    em.classList.add('curr-time');
    em.textContent=time;
    msgCell.appendChild(em);
    msgDiv.appendChild(userName);
    msgDiv.appendChild(br);
    msgDiv.appendChild(msgCell);
    
    msgContainer.append(msgDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

socket.on('user-join',name=>{
append(`${name} joined the chat`);
})

socket.on('receive-msg',data=>{
    audio.muted=true;
    audio.play();
    leftAppend(data);
    audio.muted=false;
})

form.addEventListener('submit',(e)=>{
e.preventDefault();

rightAppend(msginput.value);
socket.emit('send-msg',msginput.value);
msginput.value='';

})

//user left
socket.on('left',name=>{
    append(`${name} left the chat`);
});