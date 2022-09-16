import React, { useRef, useEffect } from "react";

function InputBtn() {
  const syllable = "cdefgab";
  const beats = [16, 8, 4, 2, 1];

  return (
    <form>
      <div>
        음계 :
        {syllable.split("").map((value, i) => (
          <label key={i}>
            <input type="radio" name="syllable" value={value} />
            {value}
          </label>
        ))}
      </div>
      <div>
        박자 :
        {beats.map((value, i) => (
          <label key={i}>
            <input type="radio" name="beats" value={value} />
            {value}
          </label>
        ))}
      </div>
    </form>
  );
}

export default InputBtn;
