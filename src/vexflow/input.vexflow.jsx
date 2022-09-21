import React, {useState, useEffect} from "react";
import BarCard from "./OneBar.vexflow";
import data from "./data";

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

function InputBtn() {
  const [sylChage, setSylChange] = useState("c");
  const [beat, setBeat] = useState("");
  const [scale, setScale] = useState();
  const [checked, setChecked] = useState(false);
  const [notes, setNotes] = useState([]);

  const obj = data;
  let idx = Object.keys(obj).length ? Object.keys(obj).length : 1;
  const ary = idx in obj ? obj[idx] : [[]];

  useEffect(() => setScale(scale), [ary]);

  if (ary.length == 4) {
    let sum = 0;
    ary.map((el) => {
      Array.isArray(el) ? (sum += 1 / el[1]) : (sum += 1 / 4);
    });
    if (sum == 1) idx++;
  }

  const forSubmit = () => {
    let input;
    if (checked) {
      input = ["b4", beat + "r"];
    } else {
      input = parseInt(beat) === 4 ? sylChage + scale : [sylChage + scale, parseInt(beat)];
    }
    ary.map((el) => {
      let sum = 0;
      el.map((element) => {
        if (Array.isArray(element)) {
          typeof element[1] === "string" ? (sum += 1 / parseInt(element[1].replace("r", ""))) : (sum += 1 / element[1]);
        } else sum += 1 / 4;
      });
      if (sum === 1) ary.push([input]);
      else if (sum + 1 / parseInt(beat) > 1) return alert("사용 불가능한 박자입니다. 다른것을 선택해주세요.");
      // roop out and need beat change
      else el.push(input);
    });

    data[idx] = ary;
    setNotes(ary);
  };

  return (
    <>
      <form className="m-1">
        <span className="m-1">
          계이름 :
          {Object.keys(syllable).map((value, i) => (
            <label key={i} className="p-2 form-check-label">
              <input type="radio" className="form-check-input" name="syllable" value={value} onChange={(e) => setSylChange(e.target.value)} />
              {korSyllable[i]}
            </label>
          ))}
        </span>
        <span className="m-1">
          박자 :
          {beats.map((value, i) => (
            <label key={i} className="p-2 form-check-label">
              <input type="radio" className="form-check-input" name="beats" value={value} onChange={(e) => setBeat(e.target.value)} />
              {value}
            </label>
          ))}
        </span>
        <label className="m-1 form-check-label">
          <input type="checkbox" className="form-check-input" name="rest" value="rest" onChange={(e) => setChecked(e.target.checked)} />
          쉼표
        </label>
        <br />
        <fieldset>
          <label htmlFor="upDown" className="form-label">
            음계 : {scale}
          </label>
          <input type="range" className="form-range" id="upDown" min={syllable[sylChage][0]} max={syllable[sylChage][1]} step="1" onChange={(e) => setScale(e.target.value)} />
        </fieldset>
        <button type="button" className="m-1 btn btn-outline-info" onClick={forSubmit} disabled={!sylChage || !beat || !scale ? true : false}>
          선택완료
        </button>
      </form>
      <BarCard notes={notes} />
    </>
  );
}

export default InputBtn;
