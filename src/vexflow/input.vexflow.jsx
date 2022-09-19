import React, { useState, useEffect } from "react";
import data from "./data";

const syllable = "cdefgab";
const beats = [16, 8, 4, 2, 1];
const restSyl = ["b4", "b4", "b4", "c5"];

function InputBtn() {
  const [sylChage, setSylChange] = useState();
  const [beat, setBeat] = useState();
  const [checked, setChecked] = useState(false);

  const obj = data;
  let idx = Object.keys(obj).length ? Object.keys(obj).length : 1;
  const ary = idx in obj ? obj[idx] : [[]];

  if (ary.length == 4) {
    let sum = 0;
    ary.map((el) => {
      Array.isArray(el) ? (sum += 1 / el[1]) : (sum += 1 / 4);
    });
    if (sum == 1) idx++;
  }

  const forSubmit = () => {
    console.log(data);
    let input;
    if (checked) {
      input = [restSyl[beats.indexOf(parseInt(beat))], beat + "r"];
    } else {
      input = parseInt(beat) === 4 ? sylChage + "4" : [sylChage + "4", parseInt(beat)];
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
    <form style={{margin:"10px"}}>
      <span style={{margin:"10px"}}>
        음계 :
        {syllable.split("").map((value, i) => (
          <label key={i} style={{padding:"5px"}}>
            <input type="radio" name="syllable" value={value} onChange={(e) => setSylChange(e.target.value)} />
            {value}
          </label>
        ))}
      </span>
      <span style={{margin:"10px"}}>
        박자 :
        {beats.map((value, i) => (
          <label key={i} style={{padding:"5px"}}>
            <input type="radio" name="beats" value={value} onChange={(e) => setBeat(e.target.value)} />
            {value}
          </label>
        ))}
      </span>
      <label style={{margin:"10px"}}>
        <input type="checkbox" name="rest" value="rest" onChange={(e) => setChecked(e.target.checked)} />
        쉼표
      </label>
      <br />
      <button type="button" onClick={forSubmit} style={{margin:"10px"}}>
        선택완료
      </button>
    </form>
  );
}

export default InputBtn;
