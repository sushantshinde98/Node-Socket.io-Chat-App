const express = require('express');
const path=require('path');
const app = express();
app.use(express.static(path.join(__dirname,'/public')));
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
//users array
const users={}

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

io.on('connection', (socket) => {
    console.log('Connected!');

    socket.on('new-user', (name) => {
        console.log(name+ ' joined!')
        users[socket.id]=name;
        socket.broadcast.emit('user-join', name)
    })

    socket.on('send-msg', msg=>{
        //data.name=users[socket.id];
        data={name:users[socket.id],message:msg}
        socket.broadcast.emit('receive-msg',data)
    })

    //disconnect
    socket.on('disconnect',()=>{
    console.log(users[socket.id]+' left the chat!');
    socket.broadcast.emit('left',users[socket.id]);
    delete users[socket.id];
});
})


http.listen(PORT, () => { console.log(`Server running at ${PORT}`); });