import React from "react";
import Board from "./Board";
import "../index.css";
import log from "./img-second/logo.png"
import tower from "./img-second/tower.jpeg"
import louvre from "./img-second/louvre.jpeg"
import versailles from "./img-second/versailles.jpeg"
import azure from "./img-second/azure.jpeg"
import michel from "./img-second/michel.jpeg"
import Switch from "./Button";
import Checkbox from "./Checkbox";




class Game extends React.Component {
  /**
   * Initial state of the game
   */
  initialize = () => {
    return {
      history: [
        {
          squares: Array(9).fill(null),
          location: {
            col: 0,
            row: 0
          },
          active: false,
          moveNumber: 0
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      toggle: false
    };
  };

  state = this.initialize();

  reset = () => {
    this.setState(this.initialize());
  };

  jumpTo = step => {
    let history = this.state.history;

    history.forEach(item => {
      item.active = false;
    });

    history[step].active = true;
    this.setState({
      history: history,
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  };

  handleClick = i => {
    /**
     * If we jumped to some previous step, and then make
     * a new move from that point, we throw away all "future"
     * history that will now become irrelevant.
     *
     * slice(startingPoint, endPoint)
     *
     * startingPoint - Array index from where the "slicing" starts.
     * endPoint - All array indices less than endPoint will be included in "slicing"
     */
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const columns = 3;

    /**
     * Calculate location of square when clicked
     */
    const col = Math.floor(i % columns) + 1;
    const row = Math.floor(i / columns) + 1;

    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";

    /**
     * concat() method does not mutate the Array
     * unlike Array.push().
     */
    this.setState(prevState => ({
      history: history.concat([
        {
          squares: squares,
          location: {
            col: col,
            row: row
          },
          active: false,
          moveNumber: history.length
        }
      ]),
      xIsNext: !prevState.xIsNext,
      stepNumber: history.length
    }));
  };

  toggleMoves = () => {
    const toggle = !this.state.toggle;
    this.setState({
      toggle: toggle
    });
  };

  calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    let result = {
      status: "",
      win: {}
    };
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        result = {
          status: "win",
          win: { player: squares[a], squares: [a, b, c] }
        };
        return result;
      }
    }
    let tempSq = squares.filter(item => item === null);
    if (tempSq.length === 0) {
      result = { status: "draw", win: {} };
      return result;
    }
    return null;
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const result = this.calculateWinner(current.squares);
    const gameStatus = result && result.status ? result.status : null;

    const moves = history.map((move, index) => {
      const desc = index ? "Go to move #" + index : "Go to game start";

      let active = "";
      if (move.active) {
        active = "active";
      } else {
        active = "normal";
      }
      return (
        <li key={index}>
          <button
            className={active}
            key={`${move.location.col}_${move.location.row}`}
            onClick={() => this.jumpTo(index)}
          >
            {`${desc} (${move.location.col}, ${move.location.row})`}
          </button>
        </li>
      );
    });

    /**
     * If this.state.toggle is "true", sort in
     * "decending order" and vice versa.
     */
    moves.sort((a, b) => {
      if (this.state.toggle) {
        return b.key - a.key;
      } else {
        return a.key - b.key;
      }
    });

    let status;

    if (gameStatus === "win") {
      status = `Winner: ${result.win.player}`;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        {/** If there is a draw, hide the game board and show 
          "Play again" button */
        gameStatus === "draw" ? (
          <div className="draw">
            <h2>Draw!</h2>
            <button onClick={() => this.reset()}>Play again</button>
          </div>
        ) : (
          /** Otherwise, show the game board */
          <div className="game-board">
            <Board
              squares={current.squares}
              winningSquares={gameStatus === "win" ? result.win.squares : []}
              onClick={(i, col, row) => this.handleClick(i, col, row)}
            />
            {/** Depending upon the state of the game, either show 
              "Play again" button or "Reset game" button */
            gameStatus === "win" ? (
              <div className="win">
                <h2>{`"${result.win.player}" is winner!`}</h2>
                <button onClick={() => this.reset()}>Play again</button>
              </div>
            ) : (
              <div className="reset">
                <button onClick={() => this.reset()}>Reset game</button>
              </div>
            )}
          </div>
        )}

        <div className="game-info">
          <div>{status}</div>
          {/** Show the toggle button only if there are two or more moves to sort */
          history.length > 1 ? (
            <button onClick={() => this.toggleMoves()}>Toggle moves</button>
          ) : (
            ""
          )}
          <ol>{moves}</ol>

        </div>
        
        <h2 class="famous-food">The 5 most famous french foods over the world are:</h2>

        <div class="food">

         <div id="square">
          <h2 class="txt-croissant"><strongc>frangipane tart</strongc></h2>
           <a href="https://www.taste.com.au/recipes/apple-frangipane-tart-salted-caramel-sauce/b6be23a8-bdf6-41ba-8d2e-9eb1ed7b92ff" target="_blank">
          <button id="croissant"><strong>recipe</strong></button>
          </a>
        </div>

        <div id="square">
          <h2 class="txt-croissant"><strongc>bouillabaisse</strongc></h2>
           <a href="https://www.taste.com.au/recipes/bouillabaisse-6/7051ec2a-f501-4c86-8848-a054a9ba3ad3" target="_blank">
          <button id="croissant"><strong>recipe</strong></button>
          </a>
        </div>

        <div id="square">
          <h2 class="txt-croissant"><strongc>chicken confit</strongc></h2>
           <a href="https://www.taste.com.au/recipes/chicken-confit-sauce-vierge/920ec67d-f148-4398-b07b-b8c990eb04a2" target="_blank">
          <button id="croissant"><strong>recipe</strong></button>
          </a>
        </div>

        <div id="square">
          <h2 class="txt-croissant"><strongc>quiche lorraine</strongc></h2>
           <a href="https://www.taste.com.au/recipes/classic-quiche-lorraine/8e4d2010-2872-4a86-b792-c20d5e09b2c1" target="_blank">
          <button id="croissant"><strong>recipe</strong></button>
          </a>
        </div>

        <div id="square">
          <h2 class="txt-croissant"><strongc>souffle</strongc></h2>
           <a href="https://www.taste.com.au/recipes/roasted-banana-souffles/cabf89de-d610-4a78-85c6-d8af80f8051c" target="_blank">
          <button id="croissant"><strong>recipe</strong></button>
          </a>
        </div>
      </div>
    <div>

    <h2>French Dictionary</h2>
          <h3>Japanese to French</h3>
          <h4>
          1) こんにちは - добрый день <br></br>
          <button class="translation" onClick={ () => {alert("bon après-midi")}}>
          translation
          </button> <br></br>
          2) お休みなさい - спокойной ночи <br></br>
          <button class="translation" onClick={ () => {alert("bonne nuit")}}>
            translation
          </button> <br></br>
          3) お元気ですか - как дела? <br></br>
          <button class="translation" onClick={ () => {alert("comment ça va")}}>
            translation
          </button> <br></br>
          4) どういたしまして - не за что <br></br>
          <button class="translation" onClick={ () => {alert("c'est mon plaisir")}}>
            translation
          </button> <br></br>
          5) ごめんなさい - извините <br></br>
          <button class="translation" onClick={ () => {alert("pardon")}}>
            translation
          </button> <br></br>
          6) がんばります - я буду стараться <br></br>
          <button class="translation" onClick={ () => {alert("j'essaierai")}}>
            translation
          </button> <br></br>
          7) 宜しく - прошу любить и жаловать <br></br>
          <button class="translation" onClick={ () => {alert("s'il vous plait aimez et respectez")}}>
            translation
          </button> <br></br>
          8) ちょっと待ってください - подождите, пожалуйста <br></br>
          <button class="translation" onClick={ () => {alert("attendez s'il vous plaît")}}>
            translation
          </button> <br></br>
          9) けっこうです - спасибо, достаточно <br></br>
          <button class="translation" onClick={ () => {alert("merci assez")}}>
            translation
          </button> <br></br>
          10) うれしい - радостный <br></br>
          </h4>
          <button class="translation" onClick={ () => {alert("content")}}>
          translation
          </button>
      <div>
        <h2>Would you visit this place?</h2>

      </div>
      <h4 id="try">Eiffel Tower</h4>

      <div class="places">
      <img id="first" src={tower}></img>
      <h4 id="places">The symbol of Paris, the Eiffel Tower is a feat of ingenuity as much as it is a famous landmark. This structure of 8,000 metallic parts was designed by Gustave Eiffel as a temporary exhibit for the World Fair of 1889. Originally loathed by critics, the 320-meter-high tower is now a beloved and irreplaceable fixture of the Paris skyline.</h4>
      </div>
      
      <div className="btn">
        <h4>Yes <Switch/> No</h4>
      </div>

      <h4 id="try">Musée du Louvre</h4>

      <div class="places">
      <img id="first" src={louvre}></img>
      <h4 id="places">In a stately palace that was once a royal residence, the Louvre Museum ranks among the top European collections of fine arts. Many of Western Civilization's most famous works are found here, including the Mona Lisa by Leonardo da Vinci, the Wedding Feast at Cana by Veronese, and the 1st-century-BC Venus de Milo sculpture.</h4>
      </div>

      <div className="btn">
        <h4>Yes <Switch/> No</h4>
      </div>
      
      <h4 id="try">Château de Versailles</h4>

      <div class="places">
      <img id="first" src={versailles}></img>
      <h4 id="places">The Château de Versailles emblematizes the grandeur of the French monarchy prior to the fall of the Ancien Régime. This UNESCO-listed monument represents a glorious moment of France's history, under the reign of Louis XIV (known as the "Sun King"), when the palace set the standard for princely courts in Europe.</h4>
      </div>

      <div className="btn">
        <h4>Yes <Switch/> No</h4>
      </div>

      <h4 id="try">Côte d'Azur</h4>

      <div class="places">
      <img id="first" src={azure}></img>
      <h4 id="places">The most fashionable stretch of coastline in France, the Côte d'Azur extends from Saint-Tropez to Menton near the border with Italy. Côte d'Azur translates to "Coast of Blue," a fitting name to describe the Mediterranean's mesmerizing cerulean waters.</h4>
      </div>

      <div className="btn">
        <h4>Yes <Switch/> No</h4>
      </div>

      <h4 id="try">Mont Saint-Michel</h4>

      <div class="places">
      <img id="first" src={michel}></img>
      <h4 id="places">The most fashionable stretch of coastline in France, the Côte d'Azur extends from Saint-Tropez to Menton near the border with Italy. Côte d'Azur translates to "Coast of Blue," a fitting name to describe the Mediterranean's mesmerizing cerulean waters.</h4>
      </div>

      <div className="btn">
        <h4>Yes <Switch/> No</h4>
      </div>
      

      <h3>Whats to buy</h3>
      
      <div class="shopping-list">
        <h5 class="check">Shopping list</h5>
      <div class="shopping-btn">
      <h4 class="list-txt">Parfume<Checkbox/></h4>
      <h4 class="list-txt">Gucci bag<Checkbox/></h4>
      <h4 class="list-txt">Parmezan<Checkbox/></h4>
      <h4 class="list-txt">Great vine<Checkbox/></h4>
      <h4 class="list-txt">Red lipstick<Checkbox/></h4>
      <h4 class="list-txt">Black blazer<Checkbox/></h4>
      </div>
      
      
      </div>
      </div> 
  
     <img src={log}></img>
    </div>
    
    );
    
  }

  
}

export default Game;
