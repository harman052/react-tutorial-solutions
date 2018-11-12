import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const Square = props => {
  return (
    <button
      className={props.highlightWinSquares}
      onClick={props.updateStateOnClick}
    >
      {props.value}
    </button>
  );
};

class Board extends React.Component {
  highlightSquares = i => {
    if (this.props.winningSquares.length > 0) {
      if (this.props.winningSquares.indexOf(i) > -1) {
        return "square winningSquares";
      } else {
        return "square";
      }
    } else {
      return "square";
    }
  };

  renderSquare(i) {
    let highlight = this.highlightSquares(i);
    return (
      <Square
        key={i}
        highlightWinSquares={highlight}
        value={this.props.squares[i]}
        updateStateOnClick={() => this.props.onClick(i)}
      />
    );
  }

  generateRow = (index, max) => {
    let rows = [];

    for (index; index < max; index++) {
      rows.push(this.renderSquare(index));
    }
    return rows;
  };

  generateBoard = (columns, rows) => {
    let board = [];

    /**
     * Generate (col * row, here, 3 * 3 = 9) squares
     */
    for (let i = 0; i < columns * rows; i++) {
      /**
       * Generate columns.
       *
       * Only allow multiples of "number of columns".
       * For example, if number of columns is 3, then,
       * 3, 6, 9.
       */
      if (i % columns === 0) {
        board.push(
          <div className="board-row" key={i}>
            {this.generateRow(i, i + columns)}
          </div>
        );
      }
    }
    return board;
  };

  render() {
    return (
      <div>
        <div>{this.generateBoard(3, 3)}</div>
      </div>
    );
  }
}

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
    // const history = this.state.history;
    // history.sort(function(a, b) {
    //   if (toggle) {
    //     return b.moveNumber - a.moveNumber;
    //   } else {
    //     return a.moveNumber - b.moveNumber;
    //   }
    // });
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

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
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
  let result = { status: "", win: {} };
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      result = {
        status: "win",
        win: { player: squares[a], squares: [a, b, c] }
      };
      return result;
    } else {
      let tempSq = squares.filter(item => item === null);
      if (tempSq.length === 0) {
        result = { status: "draw", win: {} };
        return result;
      }
    }
  }
  return null;
}
