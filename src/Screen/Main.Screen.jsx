import {Container} from "react-bootstrap";
import {useState} from "react";
import Draw from "../vexflow/draw.vexflow";
import InputS from "./Input.Screen";
import data from "../vexflow/data";

function Main() {
  const [draw, setDraw] = useState([]);
  const [show, setShow] = useState("none");
  const [drawKey, setDrawKey] = useState(1);

  const addDraw = () => {
    setDrawKey(drawKey + 1);
    setDraw(draw.concat(<Draw key={drawKey} staves={data[drawKey]} />));
    data[drawKey + 1] = [[]];
  };

  return (
    <Container>
      <button id="reload" onClick={(e) => location.reload()}>
        새로고침
      </button>
      <button id="addNote" onClick={(e) => (show == "none" ? setShow("block") : setShow("none"))}>
        음표추가
      </button>
      <button id="addDraw" onClick={addDraw}>
        악보추가
      </button>
      <div style={{display: show}}>
        <InputS index={drawKey} />
      </div>
      {draw}
    </Container>
  );
}

export default Main;
