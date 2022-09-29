import React, {useState, useEffect} from "react";
import data from "./data";
import fillRestNote from "./FillRest";
import drawMusicSheet from "./draw";
import {forUpdate, forDataIn, forDataDel} from "./inputFunc";

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
  const [beat, setBeat] = useState("");
  const [scale, setScale] = useState();
  const [checked, setChecked] = useState(false);
  const [baseStr, setBaseStr] = useState("");
  const [changeID, setChangeID] = useState("");

  let currentNotes = index in data ? [...data[index]] : ["d5/w/r", "d5/w/r", "d5/w/r", "d5/w/r"];
  let staveID = "output" + index;
  let idx = index;
  useEffect(() => {
    if (scale && beat) {
      currentNotes = [...data[idx]];
      if (changeID) {
        const sepearID = changeID.split("/");
        staveID = sepearID[0];
        idx = parseInt(staveID.replace("output", ""));
        const ary = forUpdate(sepearID, sylChage, beat, scale, checked);

        if (Array.isArray(ary)) currentNotes = ary;
        else return alert("사용 불가능한 박자입니다. 다른것을 선택해주세요.");
      } else {
        const ary = forDataIn(currentNotes, sylChage, beat, scale, checked);

        if (Array.isArray(ary)) currentNotes = ary;
        else return alert("사용 불가능한 박자입니다. 다른것을 선택해주세요.");
      }
    }
    const ary = fillRestNote(currentNotes);
    const countCheck = ary.filter((el) => el === "d5/w/r").length;
    if (countCheck != 4) {
      drawMusicSheet(ary, staveID);
      const divStave = document.getElementById(staveID);

      const svg = divStave.getElementsByTagName("svg")[0];
      const tags = svg.querySelectorAll(".vf-stavenote");
      for (let j = 0; j < tags.length; j++) {
        tags[j].addEventListener("click", function (e) {
          const id = divStave.id + "/" + j;
          setChangeID(id);
          setBaseStr(baseStr + id);
        });
      }
    }
  }, [baseStr]);

  const divStaveClicked = (evt) => {
    data[idx] = currentNotes;

    setSylChange("c");
    setBeat("");
    setChecked(false);
    setChangeID("");
    idx = index;
  };

  const deletNote = (e) => {
    const sepearID = changeID.split("/");
    const staveID = sepearID[0];
    idx = parseInt(staveID.replace("output", ""));
    if (confirm(`정말로 해당 음표를 삭제하시겠습니까?\n삭제 음표 : ${idx}번째 악보 ${parseInt(sepearID[1]) + 1}번째 음표`)) {
      currentNotes = forDataDel(sepearID);
      const ary = fillRestNote(currentNotes);
      drawMusicSheet(ary, staveID);
      const divStave = document.getElementById(staveID);

      const svg = divStave.getElementsByTagName("svg")[0];
      const tags = svg.querySelectorAll(".vf-stavenote");
      for (let j = 0; j < tags.length; j++) {
        tags[j].addEventListener("click", function (e) {
          const id = divStave.id + "/" + j;
          setChangeID(id);
          setBaseStr(baseStr + id);
        });
      }
      data[idx] = currentNotes;
    }

    setSylChange("c");
    setBeat("");
    setChecked(false);
    setChangeID("");
    idx = index;
  };

  const sylHandler = (e) => {
    setSylChange(e.target.value);
    setBaseStr(e.target.value + scale + "/" + beat);
  };
  const beatHandler = (e) => {
    setBeat(e.target.value);
    setBaseStr(e.target.value + scale + "/" + beat);
  };
  const scaleHandler = (e) => {
    setScale(e.target.value);
    setBaseStr(e.target.value + scale + "/" + beat);
  };
  const checkedHandler = (e) => {
    setChecked(e.target.checked);
    e.target.checked ? setBaseStr("b4/" + beat + "/r") : setBaseStr(sylChage + scale + "/" + beat);
  };

  return (
    <>
      <form className="m-1">
        <span className="m-1">
          계이름 :
          {Object.keys(syllable).map((value, i) => (
            <label key={i} className="p-2 form-check-label">
              <input type="radio" className="form-check-input" name="syllable" value={value} onChange={sylHandler} checked={value == sylChage ? true : false} />
              {korSyllable[i]}
            </label>
          ))}
        </span>
        <span className="m-1">
          박자 :
          {beats.map((value, i) => (
            <label key={i} className="p-2 form-check-label">
              <input type="radio" className="form-check-input" name="beats" value={value} onChange={beatHandler} checked={value == beat ? true : false} />
              {value}
            </label>
          ))}
        </span>
        <label className="m-1 form-check-label">
          <input type="checkbox" className="form-check-input" name="rest" value="rest" onChange={checkedHandler} checked={checked ? true : false} />
          쉼표
        </label>
        <br />
        <fieldset>
          <label htmlFor="upDown" className="form-label">
            음계 : {scale}
          </label>
          <input type="range" className="form-range" id="upDown" min={syllable[sylChage][0]} max={syllable[sylChage][1]} step="1" onChange={scaleHandler} />
        </fieldset>
        <button type="button" className="m-1 btn btn-outline-info" onClick={divStaveClicked} disabled={!sylChage || !beat || !scale ? true : false}>
          선택완료
        </button>
        <button type="button" className="m-1 btn btn-outline-danger" onClick={deletNote} disabled={!changeID ? true : false}>
          음표 삭제
        </button>
      </form>
    </>
  );
}

export default InputBtn;
