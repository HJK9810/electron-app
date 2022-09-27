import React, {useState, useEffect} from "react";
import {Formatter, Renderer, Stave, StaveNote, Voice, Barline, RenderContext} from "vexflow";
import {data, bars, notesOfBars} from "./data";
import {calculateWidthAndX, calculateHeightAndY} from "./draw";

const syllable = {
  c: [3, 6],
  d: [3, 5],
  e: [3, 5],
  f: [3, 5],
  g: [2, 5],
  a: [2, 5],
  b: [2, 5],
};
const beats = [16, 8, 4, 2, 1];
const korSyllable = ["도", "레", "미", "파", "솔", "라", "시"];

function InputBtn({index = 0}) {
  const [sylChage, setSylChange] = useState("c");
  const [beat, setBeat] = useState(4);
  const [scale, setScale] = useState();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setScale(scale);
    setBeat(beat);
    setSylChange(sylChage);
  }, [index]);

  const divStaveClicked = (evt) => {
    console.log(index);
    const divStave = document.getElementById("output" + index);
    const renderer = new Renderer(divStave, Renderer.Backends.SVG);
    const context = renderer.getContext();
    //- clear context: this removes previous notes and staves
    // context.clear();
    context.rect(10, 40, 750, 150, {stroke: "none", fill: "white"});
    let currentNotes = notesOfBars[0];

    //- we put a note in current bar
    let pos;
    for (let notePos = 0; notePos < currentNotes.length; notePos++) {
      if (currentNotes[notePos].customTypes[0] === "r") {
        pos = notePos;
        break;
      }
    }
    currentNotes[pos] = new StaveNote({
      clef: "treble",
      keys: [sylChage + "/" + beat],
      duration: beat,
    });

    notesOfBars[0] = currentNotes;

    //- recover and draw all bars and its notes
    for (let barPos = 0; barPos < bars.length; barPos++) {
      let widthAndX = calculateWidthAndX(bars[barPos], bars);
      let heightAndY = calculateHeightAndY(bars[barPos], bars);

      let bar = new Stave(barPos == 0 ? 10 : widthAndX, barPos == 0 ? 40 : heightAndY, Math.floor(barPos % 4) == 0 ? 400 : 350).setContext(context);
      if (barPos == 0) bar.addTimeSignature("4/4");
      if (Math.floor(barPos % 4) == 0) bar.addClef("treble");

      if (barPos == bars.length - 1) {
        bar.setEndBarType(Barline.type.END); // Last bar
      }
      bar.draw();

      const voice = new Voice({num_beats: 4, beat_value: 4}).addTickables(notesOfBars[barPos]);
      new Formatter().joinVoices([voice]).format([voice], 350);
      voice.draw(context, bars[barPos]);
    }
  };

  return (
    <>
      <form className="m-1">
        <span className="m-1">
          계이름 :
          {Object.keys(syllable).map((value, i) => (
            <label key={i} className="p-2 form-check-label">
              <input type="radio" className="form-check-input" name="syllable" value={value} onChange={(e) => setSylChange(e.target.value)} checked={value == sylChage ? true : false} />
              {korSyllable[i]}
            </label>
          ))}
        </span>
        <span className="m-1">
          박자 :
          {beats.map((value, i) => (
            <label key={i} className="p-2 form-check-label">
              <input type="radio" className="form-check-input" name="beats" value={value} onChange={(e) => setBeat(e.target.value)} checked={value == beat ? true : false} />
              {value}
            </label>
          ))}
        </span>
        <label className="m-1 form-check-label">
          <input type="checkbox" className="form-check-input" name="rest" value="rest" onChange={(e) => setChecked(e.target.checked)} checked={checked ? true : false} />
          쉼표
        </label>
        <br />
        <fieldset>
          <label htmlFor="upDown" className="form-label">
            음계 : {scale}
          </label>
          <input type="range" className="form-range" id="upDown" min={syllable[sylChage][0]} max={syllable[sylChage][1]} step="1" onChange={(e) => setScale(e.target.value)} />
        </fieldset>
        <button type="button" className="m-1 btn btn-outline-info" onClick={divStaveClicked} disabled={!sylChage || !beat || !scale ? true : false}>
          선택완료
        </button>
      </form>
    </>
  );
}

export default InputBtn;
