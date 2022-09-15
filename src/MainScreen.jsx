import { Container } from "react-bootstrap";
import { useState } from "react";
// import Board from "./vexflow/board.vexflow";
import Draw from "./vexflow/draw.vexflow";

function Main() {
  const [draw, setDraw] = useState([]);
  const addDraw = () => {
    const ary = [
      ["g2", "d4", "e4", "d4"],
      ["a4", "d4", "e4", "d4"],
      ["a4", "a4", "b4", "a4"],
      ["d4", "e4", ["g3", 2]],
    ];
    setDraw(draw.concat(<Draw staves={ary} />));
  };

  return (
    <Container>
      <button id="reload" onClick={(e) => location.reload()}>
        새로고침
      </button>
      <button id="reload">음표추가</button>
      <button id="reload" onClick={addDraw}>
        악보추가
      </button>
      {draw}
    </Container>
  );
}

export default Main;
