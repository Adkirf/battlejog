// Node imports.
import path from "path";

// Library imports.
import express, { Express } from "express";
import WebSocket from "ws";

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");


import { Login } from "./Login"


// Our collection players.  Each element is an object: { pid, score, stillPlaying }
const players: any = { };

let queue;



// Construct Express server for client resources.
const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.json());
app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT || 3000}`);
    
});

app.use("/", express.static(path.join(__dirname, "../../client/build")));

app.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

app.put("/api/signin", async(req,res)=>{
  try{
    const login = new Login();
    const users :any = await login.getUsers();
    let isAvailable = true;
    users.forEach((user:any) => {
      if(user.username===req.body.username){
        isAvailable = false;
        
      }
    })
    if(isAvailable){
      const user: any = await login.signinUser(req.body.username, req.body.password);
      const jwtToken = jwt.sign(
        user,
        process.env.JWT_SECRET,
      );
      res.status(200).json({jwtToken, user})
    }else{
      res.status(300).json({msg: "username already exists"})
    }
  }catch(err){
    res.status(400).json(err);
  }

})

app.put("/api/login",async(req,res)=>{
  try{
    const login = new Login();
    const user:any = await login.getUser(req.body.username, req.body.password);
    const jwtToken = jwt.sign(
      user,
      process.env.JWT_SECRET,
    );
    res.status(200).json({jwtToken, user})
    }catch(err){
        res.status(300).json(err);
    }
})


const wsServer = new WebSocket.Server({ port : 8080 }, function() {
  console.log("BattleJong WebSocket server ready");
});
wsServer.on("connection", (socket: WebSocket) => {


  socket.on("message", (inMsg: string) => {

    console.log(`Message: ${inMsg}`);

    const msgParts: string[] = inMsg.toString().split("_");
    const message: string = msgParts[0];
    const pid: string = msgParts[1];
    switch (message) {

      case "singleplayer":
        const tempPid = `pid${new Date().getTime()}`;
        socket.send(`connected_${tempPid}`);
        players[tempPid] = { score : 0, stillPlaying : true, client: socket, username: pid, opponent: ""};
        const shuffledLayout: number[][][] = shuffle();
        players[tempPid].layout = JSON.stringify(shuffledLayout);
        socket.send(`start_${JSON.stringify(shuffledLayout)}`);
        break;

      case "multiplayer":
        let playerPid:string|undefined = Object.keys(players).find( existingPid => {
          return players[existingPid].username === pid;
        })

        if(!playerPid || !players[playerPid].stillPlaying  ){
          console.log(!playerPid);
          console.log(players[playerPid?playerPid:"0"]);
          console.log(queue!==playerPid);

          playerPid = playerPid? playerPid : `pid${new Date().getTime()}`;
          socket.send(`connected_${playerPid}`);
          players[playerPid] = { score : 0, stillPlaying : true, client: socket, username: pid, opponent: ""};
          const isInQueue = queuePlayer(playerPid);
          if(!isInQueue){
            const shuffledLayout: number[][][] = shuffle();
            players[playerPid].layout = JSON.stringify(shuffledLayout);
            players[players[playerPid].opponent].layout = JSON.stringify(shuffledLayout);
            players[players[playerPid].opponent].client.send(`start_${JSON.stringify(shuffledLayout)}`);
            socket.send(`start_${JSON.stringify(shuffledLayout)}`);
          }
        }else{
          socket.send(`connected_${playerPid}`);
          
          if(queue!==playerPid){
            const {layout, score, opponent} = players[playerPid];
            const opponentscore = opponent? players[opponent].score : 0;
            socket.send(`session_${layout}_${score}_${opponentscore}`)
          }
        }

      break;

    case "match":
      players[pid].score += parseInt(msgParts[2]);
      players[pid].layout = msgParts[3];
      if(players[pid].opponent){
        players[players[pid].opponent].client.send(`update_${players[pid]}_${players[pid].score}}}`)
      }
      break;

    case "done":
        let player: any = players[pid];
        let opponent: any = players[players[pid].opponent];
        player.stillPlaying = false;
    
        if (!opponent||!opponent.stillPlaying) {
          let winningPid: string;
          
          winningPid = player.opponent? (opponent.score ? pid : player.opponent) : pid; 
          
          player.client.send(`gameOver_${winningPid}`);
          if(!opponent.stillPlaying){
            opponent.client.send(`gameOver_${winningPid}`);
          }
        }
      break;

    case "quit": 
       player = players[pid];
       opponent = players[players[pid].opponent];
      player.stillPlaying = false;
      let winningPid = opponent? opponent : pid;
      socket.send(`gameOver_${winningPid}`);
      if(opponent){
        opponent.opponent = "";
      }
      break;
    } 
    
  }); 
  


}); 

const queuePlayer = (pid: string) =>{
  if(queue){
    players[queue].opponent = pid;
    players[pid].opponent = queue;
    queue = undefined;
    return false;
  }else{
    queue = pid;
    return true;
  }
}



const layout: number[][][] = [
  [
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
    [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
    [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
  ],
  [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  ],
  [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  ],
  [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  ],
  [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  ]
]; 

function shuffle(): number[][][] {

  const cl: number[][][] = layout.slice(0);

  let numWildcards: number = 0;

  const numTileTypes: number = 42;
  for (let l: number = 0; l < cl.length; l++) {
    const layer: number[][] = cl[l];
    for (let r: number = 0; r < layer.length; r++) {
      const row: number[] = layer[r];
      for (let c: number = 0; c < row.length; c++) {
        const tileVal: number = row[c];
        if (tileVal === 1) {
          row[c] = (Math.floor(Math.random() * numTileTypes)) + 101;

          if (row[c] === 101 && numWildcards === 3) {
            row[c] = 102;
          } else {
            numWildcards += numWildcards;
          }
        } 
      } 
    } 
  } 

  return cl;

}