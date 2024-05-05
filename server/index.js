const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const generateRoomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const codeLength = 3; // Длина кода комнаты
  let code = '';

  for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
  }

  return code;
};
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors()); 
app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', (socket) => {
  var roomS;
  var nameS;
  console.log('User has joined');
  socket.on("reqToJoinToTheRoom", ({ name, room }) => {
    const rooms = io.sockets.adapter.rooms;
    const roomExists = rooms.has(room); 
    if (roomExists) {
      const roomC = io.sockets.adapter.rooms.get(room);
      const userIds = Array.from(roomC.keys());
        socket.join(room);
        
        socket.emit("joinRoomSuccess", { res:true, room });
        if (userIds.length > 0) {
          const userId = userIds[0]; 
          
          
          console.log(`Пользователь ${name} присоединился к комнате ${room}`);
          
          const userSocket = io.sockets.sockets.get(userId);
          userSocket.emit('Message', { type:"join",message: `Пользователь ${name} подключился` });
          
          roomS = room
          nameS = name
          const suggestedWords = {};
          socket.on("SuggestTheWord", (data) => {
          
            if (!suggestedWords[data]) {
              
                userSocket.emit('Message', { type: "suggest", message: `${name} предлагает "${data}"` });
                userSocket.emit("NewSuggestedWord", {word:data, name:nameS})
                suggestedWords[data] = true;
            } else {
                // Если слово уже было предложено, можно выполнить какое-то действие, например, вывести сообщение об ошибке или проигнорировать дубликат
                console.log(`Слово "${data}" уже было предложено`);
                socket.emit("SuggestWordFail", {res:false, mess:`Слово "${data}" уже было предложено`});
            }
        });
      } else {
          console.log('В комнате нет пользователей');
      }
    } else {
        
        // console.log(`Комната ${room} не существует`);
        socket.emit("joinRoomFailure", {res:false, room:room});
    }
  });

  socket.on("createTheRoom", () => {
      
      let code;
      let roomExists = true;

      while (roomExists) {
          code = generateRoomCode();
          roomExists = false;

          // Получаем список комнат
          const rooms = io.sockets.adapter.rooms;

          // Преобразование в массив и фильтрация только по комнатам (исключая подключения)
          const roomNames = Object.keys(rooms).filter(roomId => !rooms[roomId].sockets[roomId]);

          // Проверяем, есть ли комната с сгенерированным кодом
          for (let i = 0; i < roomNames.length; i++) {
              if (roomNames[i] === code) {
                  roomExists = true;
                  break;
              }
          }
      }
      room = code
      console.log(code)
      socket.emit("GetRoomCode", code);
      socket.join(code);
      
    });
    socket.on("disconnect", () => {
      console.log("Пользователь отключился");
      const roomC = io.sockets.adapter.rooms.get(roomS);
      if (roomC) {
          const userIds = Array.from(roomC.keys());
          if (userIds.length > 0) {
              const userId = userIds[0]; 
              const userSocket = io.sockets.sockets.get(userId);
              if (userSocket) {
                  userSocket.emit('Message', { type: "disconnect", message: `Пользователь ${nameS} отключился` });
                
              }
          }
      }
  });
  
});


const PORT = process.env.PORT || 5005;
server.listen(PORT, () => {
  const os = require('os');
  const fs = require('fs');

  // Указываем путь к директории
  const directoryPath = '../my-app/src/Route.jsx';
  


  
  function getLocalIPv4Address() {
    const interfaces = os.networkInterfaces();
    const ips = []
    for (const interfaceName in interfaces) {
      const iface = interfaces[interfaceName];
      for (const address of iface) {
        if(address.family == 'IPv4' && address.internal == false ){
          ips.push(address.address)
        }
      }
    }
    console.log("http://" + ips[1] + ":" + PORT + "/")
    const newContent = `import React, { useEffect } from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter, Routes, and Route
    import io from 'socket.io-client';
    import Form from './Form';
    import Host from './host';
    import User from './user';
    
    
    const socket = io.connect('http://${ips[1] + ":" + PORT}');
    
    const MyComponent = () => {
    
        return (
            <Router> 
                <Routes> 
                    <Route path="/" element={<User socket= {socket} />} />
                    <Route path='/host' element={<Host socket= {socket}></Host>}></Route>
                </Routes>
            </Router>
        );
    };
    
    export default MyComponent;
    `
    
      
    fs.writeFile(directoryPath, newContent, err => {
      if (err) {
        console.error('Ошибка при записи файла:', err);
        return;
      }
    
      console.log('Содержимое файла успешно изменено.');
    });
}
  
getLocalIPv4Address()
  console.log(`Server is running on port ${PORT}`);
});
