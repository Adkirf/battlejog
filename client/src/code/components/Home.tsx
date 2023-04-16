import React from "react";
import { useSignOut, useAuthUser, useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

import SquaredMenu from "./SquaredMenu";

function Home() {
  const singOut = useSignOut();
  const auth = useAuthUser()
  const navigate = useNavigate();

  const handleMenuClick = (label:String) => {
    switch(label){
      case "Play":
        navigate("/game")
        break;

      case "Logout":
        singOut();
        navigate("/login")
        break;

      case "Login":
        navigate("/login")
        break;
      
      case "Demo Game": 
        navigate("/game")
        break;
    }
  }


  const centerTile = (text: String) =>{
    return(<h1>
      {text}
    </h1>)
  }


  return (
    <div className="container">
      {auth() && 
       SquaredMenu(["Play","Logout"],centerTile(`Welcome back ${auth()!.username}`), 0,handleMenuClick)
      }

      {!auth() &&
       SquaredMenu(["Login", "Demo Game"],centerTile("Welcome to BattleJog"), 0,handleMenuClick)
      }
    </div>
  );
}

export default Home
