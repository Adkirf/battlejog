// React imports.
import React,{ useEffect} from "react";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";



const ControlArea = ({ state }: any) => {
  const auth = useAuthUser();
  const navigate = useNavigate();

  useEffect(()=>{
    if(auth()){
      state.initUser(auth()!.username)
    }
    else{
      state.initUser("");
    }
  },[])

  const getStats = () => {
    
    if(state.gameState === "awaitingOpponent"){
      return <div style={{ color:"#ff0000", fontWeight:"bold", textAlign:"center" }}>Waiting for opponent to join</div>
    }else{
      return <div>
        <div style={{ float:"left", width:"130px" }}>Your score:</div><div>{state.scores.player}</div>
          {auth()&&
            <div> 
              <div style={{ float:"left", width:"130px" }}>Opponent score:</div><div>{state.scores.opponent}</div>
              <br />
            </div>
          }
        </div>
    }
  }

  return(
    <React.Fragment>
      {getStats()}
      <hr style={{ width:"75%", textAlign:"center" }} />
      <br />
      { state.gameState === "deadEnd" &&
        <div style={{ color:"#ff0000", fontWeight:"bold", textAlign:"center" }}>
          You have no moves left.<br /><br />Waiting for opponent to finish.
        </div>
      }
      { state.gameState === "cleared" &&
        <div style={{ color:"#ff0000", fontWeight:"bold", textAlign:"center" }}>
          Congratulations!<br /><br />You've cleared the board!<br /><br />Waiting for opponent to finish.
        </div>
      }
      { state.gameState === "gameOver" &&
        <div style={{ color:"#ff0000", fontWeight:"bold", textAlign:"center" }}>
          The game is over.<br /><br />
          { state.gameOutcome }
        </div>
      }
      <button className="loginButton" onClick={()=>navigate("/")}>
        Home
      </button>
      { state.gameState === "playing" &&
        <button className="loginButton" onClick={()=>{state.quitGame()}}>
          Quit
        </button>
      }

    </React.Fragment>
  )


}


export default ControlArea;