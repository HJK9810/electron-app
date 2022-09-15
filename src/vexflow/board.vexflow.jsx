import { Renderer, Stave, StaveNote, Formatter } from "vexflow";

function board() {
  const div = document.getElementById("output");
  let renderer; // rendering box size and set
  let context; // size setting
  let stave; // for clef and meter && for draw
  let notes = []; // for notes ary

  const draw = () => {
    const syllable = "cdefgab";
    const choice = Math.floor(Math.random() * 7);

    if (notes.length == 4) {
      alert("더이상의 4분음표 입력은 불가능합니다. 다른 악보를 그려주세요.");
    } else {
      notes.push(
        new StaveNote({ keys: [`${syllable[choice]}/4`], duration: "q" })
      );

      // Helper function to justify and draw a 4/4 voice.
      Formatter.FormatAndDraw(context, stave, notes);
    }
  };

  const drawPage = () => {
    notes = [];
    renderer = new Renderer(div, Renderer.Backends.SVG);

    renderer.resize(750, 150);
    context = renderer.getContext();
    context.setFont("Arial", 10);

    stave = new Stave(10, 40, 700);
    stave.addClef("treble").addTimeSignature("4/4");

    stave.setContext(context).draw();
  };

  return (
    <>
      <button id="reload" onClick={(e) => location.reload()}>
        새로고침
      </button>
      <button id="draw" onClick={draw}>
        음표 추가
      </button>
      <button id="drawPage" onClick={drawPage}>
        악보추가
      </button>
      <br />
      <p>악보추가 버튼을 눌러주세요!!!</p>

      <div id="output"></div>
    </>
  );
}

export default board;
