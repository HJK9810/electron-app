import {useEffect, useState} from "react";

const BarCard = ({notes = [[]]}) => {
  const [ary, setAry] = useState([]);
  const korSyllable = {
    c: "도",
    d: "레",
    e: "미",
    f: "파",
    g: "솔",
    a: "라",
    b: "시",
  };

  useEffect(() => {
    setAry(notes);
  }, [notes]);

  return (
    <div>
      {ary.map((el, i) => (
        <ul key={i} className="m-1 list-group d-inline-block" style={{width: "24%"}}>
          {el.map((element, idx) => {
            let line = "";
            if (Array.isArray(element)) {
              const syllable = element[0].charAt(1) + "옥타브 " + korSyllable[element[0].charAt(0)];
              let beat = element[1] + "";
              if (beat && beat.includes("r")) {
                beat = beat.replace("r", "");
                line = parseInt(beat) == 1 ? "온쉼표" : beat + "분쉼표";
              } else {
                line = beat == 1 ? syllable + " 온음표" : syllable + " " + beat + "분음표";
              }
            } else line = element.charAt(1) + "옥타브 " + korSyllable[element.charAt(0)] + " 4분음표";
            return (
              <li key={i + idx / 100} className="list-group-item">
                {line}
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
};

export default BarCard;
