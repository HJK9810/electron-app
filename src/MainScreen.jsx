import { Container } from "react-bootstrap";
import { useState } from "react";
import Draw from "./vexflow/draw.vexflow";
import InputBtn from "./vexflow/input.vexflow";

function Main() {
  const [draw, setDraw] = useState([]);
  const [show, setShow] = useState("none");
  const [drawKey, setDrawKey] = useState(0);

  const addDraw = () => {
    setDrawKey(drawKey + 1);
    const ary = [
      ["g2", "d4", "e4", "d4"],
      ["a4", "d4", "e4", "d4"],
      ["a4", "a4", "b4", "a4"],
      ["d4", "e4", ["g3", 2]],
    ];
    setDraw(draw.concat(<Draw key={drawKey} staves={ary} />));
  };

  return (
    <Container>
      <button id="reload" onClick={(e) => location.reload()}>
        새로고침
      </button>
      <button
        id="reload"
        onClick={(e) => (show == "none" ? setShow("block") : setShow("none"))}
      >
        음표추가
      </button>
      <button id="reload" onClick={addDraw}>
        악보추가
      </button>
      <div style={{ display: show }}>
        <InputBtn />
      </div>
      {draw}
    </Container>
  );
}

export default Main;
