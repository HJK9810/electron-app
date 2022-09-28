import {Container} from "react-bootstrap";
import {useState} from "react";
import Draw from "../vexflow/draw2.vexflow";
import InputBtn from "../vexflow/input2.vexflow";

function Main() {
  const [draw, setDraw] = useState([]);
  const [show, setShow] = useState("none");
  const [drawKey, setDrawKey] = useState(0);
  const [clickID, setClickID] = useState(drawKey + 1);

  const addDraw = () => {
    setDrawKey(drawKey + 1);
    setClickID(drawKey + 1);
    setDraw(draw.concat(<Draw key={drawKey} index={drawKey + 1} />));
  };

  window.addEventListener("click", (e) => {
    if (Array.isArray(e.path)) {
      e.path.forEach((el) => {
        if (el.id && el.id.includes("output")) {
          parseInt(el.id.replace("ouput", "")) ? setClickID(parseInt(el.id.replace("ouput", ""))) : setClickID(clickID);
        }
      });
    }
    console.log(clickID);
  });

  return (
    <Container>
      <button id="reload" className="m-1 btn btn-outline-warning" onClick={(e) => location.reload()}>
        새로고침
      </button>
      <button id="addNote" className="m-1 btn btn-outline-success" onClick={(e) => (show == "none" ? setShow("block") : setShow("none"))}>
        음표추가
      </button>
      <button id="addDraw" className="m-1 btn btn-outline-success" onClick={addDraw}>
        악보추가
      </button>

      <div style={{display: show}}>
        <InputBtn index={drawKey} />
      </div>
      {draw}
    </Container>
  );
}

export default Main;
