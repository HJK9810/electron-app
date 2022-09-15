import { Container } from "react-bootstrap";
// import Board from "./vexflow/board.vexflow";
import Draw from "./vexflow/draw.vexflow";

function Main() {
  return (
    <Container>
      <button id="reload" onClick={(e) => location.reload()}>
        새로고침
      </button>
      <Draw
        staves={[
          ["g2", "d4", "e4", "d4"],
          ["a4", "d4", "e4", "d4"],
          ["a4", "a4", "b4", "a4"],
          ["d4", "e4", ["g3", 2]],
        ]}
      ></Draw>
    </Container>
  );
}

export default Main;
