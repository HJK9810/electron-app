import {Container} from "react-bootstrap";
import {useState, useEffect} from "react";
import Draw from "../vexflow/draw2.vexflow";
import InputBtn from "../vexflow/input2.vexflow";
import data from "../vexflow/data";

function Main() {
  const [draw, setDraw] = useState([]);
  const [show, setShow] = useState("none");
  const [drawKey, setDrawKey] = useState(0);

  useEffect(() => {
    for (let i = 1; i <= drawKey; i++) {
      const getid = document.getElementById("output" + i);
      const tags = getid.querySelectorAll("svg.vf-stavenote");
      for (let j = 0; j < tags.length; j++) {
        console.log(tags[j]);
        tags[j].addEventListener("mouseover", function (e) {
          tags[j].style.cssText = "1px solid red";
        });
        tags[j].addEventListener("mousedown", function (e) {
          tags[j].style.cssText = "";
        });
      }
    }
  }, [data[drawKey]]);

  const addDraw = () => {
    setDrawKey(drawKey + 1);
    setDraw(draw.concat(<Draw key={drawKey} index={drawKey + 1} />));
  };

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
