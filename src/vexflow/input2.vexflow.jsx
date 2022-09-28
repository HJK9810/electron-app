import React, {useState, useEffect} from "react";
import {Factory, Formatter, Renderer, Stave, StaveNote, Voice} from "vexflow";
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
    const vf = new Factory({renderer: {elementId: "output" + index, width: 750, height: 150}});
    let score = vf.EasyScore();
    score.set({time: "4/4"});

    let currentNotes = data[index];
    console.log(currentNotes);
    //- we put a note in current bar
    let out = false;
    for (let notePos = 0; notePos < currentNotes.length; notePos++) {
      const line = currentNotes[notePos].split(" ");
      for (let i = 0; i < line.length; i++) {
        if (line[i].includes("r")) {
          line[i] = sylChage + scale + "/" + beat;
          currentNotes[notePos] = line.join(" ");
          out = true;
          break;
        }
      }
      if (out) break;
    }

    data[index] = fillRestNote(currentNotes);
    console.log(data[index]);

    const clefAndTimeWidth = 60;
    const staveWidth = (700 - clefAndTimeWidth) / 4;
    //- recover and draw all bars and its notes

    let currX = 0;
    let system = vf.System({x: currX, y: 0, width: staveWidth + clefAndTimeWidth, spaceBetweenStaves: 10});
    currentNotes.forEach((notes, i) => {
      if (!i) {
        system
          .addStave({
            voices: [score.voice(score.notes(notes))],
          })
          .addClef("treble")
          .addTimeSignature("4/4");

        currX += staveWidth + clefAndTimeWidth;
      } else {
        system = vf.System({x: currX, y: 0, width: staveWidth, spaceBetweenStaves: 10});
        system.addStave({
          voices: [score.voice(score.notes(notes))],
        });
        currX += staveWidth;
      }
    });

    vf.draw();
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
