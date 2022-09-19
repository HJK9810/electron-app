import { Container } from "react-bootstrap";
import { useState } from "react";
import Draw from "./vexflow/draw.vexflow";
import InputBtn from "./vexflow/input.vexflow";
import BarCard from "./vexflow/OneBar.vexflow";
import data from "./vexflow/data";

function Main() {
  const [draw, setDraw] = useState([]);
  const [show, setShow] = useState("none");
  const [drawKey, setDrawKey] = useState(1);

  const addDraw = () => {
    setDrawKey(drawKey + 1);
    const ary = data[drawKey];
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
      <div style={{ display: show }}>
        <BarCard index={drawKey} />
      </div>
      {draw}
    </Container>
  );
}

export default Main;
