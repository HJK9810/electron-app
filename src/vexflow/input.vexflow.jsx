import React, { useState, useEffect } from "react";
import data from "./data";

function InputBtn() {
  const [sylChage, setSylChange] = useState();
  const [beat, setBeat] = useState();
  const syllable = "cdefgab";
  const beats = [16, 8, 4, 2, 1];
  const obj = data;
  let idx = Object.keys(obj).length ? Object.keys(obj).length : 1;
  const ary = idx in obj ? obj[idx] : [];

  if (ary.length == 4) {
    let sum = 0;
    ary.map((el) => {
      Array.isArray(el) ? (sum += 1 / el[1]) : (sum += 1 / 4);
    });
    if (sum === 1) idx++;
  }

  const forSubmit = () => {
    const input = parseInt(beat) === 4 ? sylChage + "4" : [sylChage + "4", parseInt(beat)];
    const inCheck = false;
    ary.map((el) => {
      let sum = 0;
      el.map((element) => {
        Array.isArray(element) ? (sum += 1 / element[1]) : (sum += 1 / 4);
      });
      if (sum === 1) inCheck = true;
      else {
        el.push(input);
        inCheck = true;
      }
    });

    if (!inCheck) ary.push([input]);
    data[idx] = ary;
    console.log(data);
  };

  return (
    <form>
      <div>
        음계 :
        {syllable.split("").map((value, i) => (
          <label key={i}>
            <input type="radio" name="syllable" value={value} onChange={(e) => setSylChange(e.target.value)} />
            {value}
          </label>
        ))}
      </div>
      <div>
        박자 :
        {beats.map((value, i) => (
          <label key={i}>
            <input type="radio" name="beats" value={value} onChange={(e) => setBeat(e.target.value)} />
            {value}
          </label>
        ))}
      </div>
      <button type="button" onClick={forSubmit}>
        선택완료
      </button>
    </form>
  );
}

export default InputBtn;
