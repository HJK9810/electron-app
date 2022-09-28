import React, {useState, useEffect} from "react";
import {Formatter, Renderer, Stave, StaveNote, Voice, Barline, RenderContext} from "vexflow";
import {data, bars, notesOfBars} from "./data";
import fillRestNote from "./FillRest";
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
    const divStave = document.getElementById("output" + index);
    divStave.innerHTML = "";
    const renderer = new Renderer(divStave, Renderer.Backends.SVG);
    renderer.resize(750, 150);
    const context = renderer.getContext();
    context.setFont("Arial", 10);
    //- clear context: this removes previous notes and staves
    // context.clear();
    // context.rect(10, 40, 750, 150, {stroke: "none", fill: "white"});
    let currentNotes = index in data ? data[index] : [];
    console.log(data[index]);
    //- we put a note in current bar
    let pos;
    let out = false;
    for (let notePos = 0; notePos < currentNotes.length; notePos++) {
      for (let i = 0; i < currentNotes[notePos].length; i++) {
        if (currentNotes[notePos][i].customTypes[0] === "r") {
          pos = notePos + "," + i;
          out = true;
          break;
        }
      }
      if (out) break;
    }

    const posArr = pos.split(",");
    currentNotes[parseInt(posArr[0])][parseInt(posArr[1])] = new StaveNote({
      clef: "treble",
      keys: [sylChage + "/" + scale],
      duration: beat,
    });
    // if (posAry[1] == "0") {
    //   currentNotes.push(forInput);
    // } else {
    //   currentNotes[parseInt(posAry[0])][parseInt(posAry[1])] = forInput;
    // }
    console.log(currentNotes);
    data[index] = currentNotes;
    console.log(data[index]);

    const clefAndTimeWidth = 60;
    const staveWidth = (700 - clefAndTimeWidth) / 4;
    //- recover and draw all bars and its notes
    for (let barPos = 0; barPos < 4; barPos++) {
      let currX = 0;
      currentNotes[barPos].forEach((notes, i) => {
        const stave = new Stave(currX, 0, staveWidth);
        if (!i) {
          stave.setWidth(staveWidth + clefAndTimeWidth);
          stave.addClef("treble").addTimeSignature("4/4");
        }
        currX += stave.getWidth();
        stave.setContext(context).draw();
        Formatter.FormatAndDraw(context, stave, notes);
      });
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
