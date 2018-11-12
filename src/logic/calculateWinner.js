export default function calculateWinner(squares) {
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
