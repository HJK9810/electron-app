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

function InputBtn() {
  const [sylChage, setSylChange] = useState("c");
  const [beat, setBeat] = useState("");
  const [scale, setScale] = useState();
  const [checked, setChecked] = useState(false);

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
  };

  return (
    <>
      <form style={{margin: "10px"}}>
        <span style={{margin: "10px"}}>
          계이름 :
          {Object.keys(syllable).map((value, i) => (
            <label key={i} style={{padding: "5px"}}>
              <input type="radio" name="syllable" value={value} onChange={(e) => setSylChange(e.target.value)} />
              {value}
            </label>
          ))}
        </span>
        <span style={{margin: "10px"}}>
          박자 :
          {beats.map((value, i) => (
            <label key={i} style={{padding: "5px"}}>
              <input type="radio" name="beats" value={value} onChange={(e) => setBeat(e.target.value)} />
              {value}
            </label>
          ))}
        </span>
        <label style={{margin: "10px"}}>
          <input type="checkbox" name="rest" value="rest" onChange={(e) => setChecked(e.target.checked)} />
          쉼표
        </label>
        <br />
        <label>
          음계 : <input type="number" name="upDown" min={syllable[sylChage][0]} max={syllable[sylChage][1]} placeholder={"over " + syllable[sylChage][0]} onChange={(e) => setScale(e.target.value)} />
          ("{syllable[sylChage][0]}보다 크고 {syllable[sylChage][1]}보다 작은 수를 입력해주세요.")
        </label>
        <button type="button" onClick={forSubmit} style={{margin: "10px"}} disabled={!sylChage || !beat || !scale ? true : false}>
          선택완료
        </button>
      </form>
      <BarCard notes={data[idx]} />
    </>
  );
}

export default InputBtn;
