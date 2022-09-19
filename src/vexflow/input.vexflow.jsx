import React, { useState, useEffect } from "react";
import data from "./data";

function InputBtn() {
  const [sylChage, setSylChange] = useState();
  const [beat, setBeat] = useState();
  const [checked, setChecked] = useState(false);

  const syllable = "cdefgab";
  const beats = [16, 8, 4, 2, 1];
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
    let input;
    if (parseInt(beat) === 4) input = sylChage + "4";
    else {
      input = checked ? [sylChage, beat] : [sylChage + "4", parseInt(beat)];
    }
    ary.map((el) => {
      let sum = 0;
      el.map((element) => {
        if (Array.isArray(element))
          typeof element === "string"
            ? (sum += 1 / parseInt(element[1].replace("r", "")))
            : (sum += 1 / element[1]);
        else sum += 1 / 4;
      });
      if (sum === 1) ary.push([input]);
      else if (sum + 1 / parseInt(beat) > 1)
        return alert("사용 불가능한 박자입니다. 다른것을 선택해주세요.");
      // roop out and need beat change
      else el.push(input);
    });

    data[idx] = ary;
  };

  const restCheck = (e) => {
    if (e) {
      setChecked(true);
      switch (beat) {
        case 16:
          setSylChange("c4");
          break;
        case 8:
          setSylChange("c4");
          break;
        case 4:
          setSylChange("d4");
          break;
        case 2:
          setSylChange("c5");
          break;
        default:
          setSylChange("d5");
          break;
      }
      setBeat(beat + "r");
    } else setChecked(false);
  };

  return (
    <form>
      <div>
        음계 :
        {syllable.split("").map((value, i) => (
          <label key={i}>
            <input
              type="radio"
              name="syllable"
              value={value}
              onChange={(e) => setSylChange(e.target.value)}
            />
            {value}
          </label>
        ))}
      </div>
      <div>
        박자 :
        {beats.map((value, i) => (
          <label key={i}>
            <input
              type="radio"
              name="beats"
              value={value}
              onChange={(e) => setBeat(e.target.value)}
            />
            {value}
          </label>
        ))}
      </div>
      <label>
        <input type="checkbox" name="rest" value="rest" onChange={restCheck} />
        쉼표
      </label>
      <br />
      <button type="button" checked={checked} onClick={forSubmit}>
        선택완료
      </button>
    </form>
  );
}

export default InputBtn;
