// React imports.
import React, { Component } from "react";

// Library imports.

// App imports.
import ControlArea from "./ControlArea";
import PlayerBoard from "./PlayerBoard";
import { createState } from "../state";



class Game extends Component {


  state = createState(this);

 render() {

    return (
      <div className="container">
        <div className="containerBorder game">
            <div className="playerBoard"><PlayerBoard state={ this.state } /></div>
            <div className="controlArea"><ControlArea state={ this.state } /></div>   
        </div>
      </div>

   );

  } 


} 


export default Game;