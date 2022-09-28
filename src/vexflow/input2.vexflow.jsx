import React, {useState, useEffect} from "react";
import {Factory} from "vexflow";
import data from "./data";
import fillRestNote from "./FillRest";

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
const clefAndTimeWidth = 60;
const staveWidth = (700 - clefAndTimeWidth) / 4;

function InputBtn({index = 0}) {
  const [sylChage, setSylChange] = useState("c");
  const [beat, setBeat] = useState("");
  const [scale, setScale] = useState();
  const [checked, setChecked] = useState(false);

  let currentNotes = index in data ? [...data[index]] : ["d5/w/r", "d5/w/r", "d5/w/r", "d5/w/r"];
  useEffect(() => {
    let out = false;
    if (scale && beat) {
      currentNotes = [...data[index]];
      for (let notePos = 0; notePos < currentNotes.length; notePos++) {
        if (currentNotes[notePos].includes("w") && (notePos == 0 || !out)) {
          currentNotes[notePos] = sylChage + scale + "/" + beat;
          out = true;
        } else {
          const line = currentNotes[notePos].trim().split(",");

          let sum = 0;
          for (let i = 0; i < line.length; i++) {
            const ary = line[i].split("/");
            sum += 1 / parseInt(ary[1]);
          }
          if (sum + 1 / parseInt(beat) <= 1) {
            checked ? line.push("b4/" + beat + "/r") : line.push(sylChage + scale + "/" + beat);
            out = true;
          } else if (sum != 1 && sum + 1 / parseInt(beat) > 1) return alert("사용 불가능한 박자입니다. 다른것을 선택해주세요."); // roop out and need beat change

          currentNotes[notePos] = line.join(", ");
        }
        if (out) break;
      }
    }
    const ary = fillRestNote(currentNotes);
    const countCheck = ary.filter((el) => el === "d5/w/r").length;
    if (countCheck != 4) {
      const divStave = document.getElementById("output" + index);
      if (divStave.innerHTML) divStave.innerHTML = "";
      const vf = new Factory({renderer: {elementId: "output" + index, width: 750, height: 150}});
      let score = vf.EasyScore();
      score.set({time: "4/4"});

      let currX = 0;
      let system = vf.System({x: currX, y: 0, width: staveWidth + clefAndTimeWidth, spaceBetweenStaves: 10});
      ary.forEach((note, i) => {
        if (!i) {
          system
            .addStave({
              voices: [score.voice(score.notes(note))],
            })
            .addClef("treble")
            .addTimeSignature("4/4");

          currX += staveWidth + clefAndTimeWidth;
        } else {
          system = vf.System({x: currX, y: 0, width: staveWidth, spaceBetweenStaves: 10});
          system.addStave({
            voices: [score.voice(score.notes(note))],
          });
          currX += staveWidth;
        }
      });

      vf.draw();
    }
  }, [scale]);

  const divStaveClicked = (evt) => {
    data[index] = currentNotes;

    setSylChange("c");
    setBeat("");
    setChecked(false);
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
