import React from "react";


export function createSocketComm(inParentComponent: React.Component, username:string) {


  const connection: WebSocket = new WebSocket("ws://battlejog-production.up.railway.app:8080");

  connection.onopen = () => {
    console.log("Connection opened to server");
    if(!username){
      console.log("connecting as test user");
      connection.send(`singleplayer`)
    }else{
      console.log(`connecting ${username}`)
      connection.send(`multiplayer_${username}`)
    }
  };

  connection.onerror = error => {
    console.log(`WebSocket error: ${error}`)
    console.log(error);
  };

  connection.onmessage = function(inMessage: any) {

    console.log(`WS received: ${inMessage.data}`);

    const msgParts: string[] = inMessage.data.split("_");
    const message: string = msgParts[0];

    switch (message) {

      case "connected": 
        this.state.handleMessage_connected(msgParts[1]);
      break;

      case "start": 
        this.state.handleMessage_start(JSON.parse(msgParts[1]));
      break;

      case "session":
        this.state.handleMessage_session(JSON.parse(msgParts[1]),msgParts[2],msgParts[3])
      break;

      case "update": 
        this.state.handleMessage_update(msgParts[1], parseInt(msgParts[2]));
      break;

      case "gameOver": 
        this.state.handleMessage_gameOver(msgParts[1]);
      break;
    }

  }.bind(inParentComponent);

  return connection;


}