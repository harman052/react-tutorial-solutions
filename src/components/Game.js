import React from "react";
import Board from "./Board";
import calculateWinner from "../logic/calculateWinner";
import "../index.css";

class Game extends React.Component {
  initialize = () => {
    return {
      history: [
        {
          squares: Array(9).fill(null),
          location: { col: 0, row: 0 },
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
    let history = this.state.history.slice();

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
     * startingPoint - Array index from which we want to start "slicing"
     * endPoint - Array index less than this will be included in the "slicing"
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

    if (calculateWinner(squares) || squares[i]) {
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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const result = calculateWinner(current.squares);
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
        {gameStatus === "draw" ? (
          <div className="draw">
            <h2>Draw!</h2>
            <button onClick={() => this.reset()}>Play again</button>
          </div>
        ) : (
          <div className="game-board">
            <Board
              squares={current.squares}
              winningSquares={gameStatus === "win" ? result.win.squares : []}
              onClick={(i, col, row) => this.handleClick(i, col, row)}
            />
            {gameStatus === "win" ? (
              <div className="win">
                <h2>{`${result.win.player} wins!`}</h2>
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
          {history.length > 1 ? (
            <button onClick={() => this.toggleMoves()}>Toggle moves</button>
          ) : (
            ""
          )}
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default Game;
