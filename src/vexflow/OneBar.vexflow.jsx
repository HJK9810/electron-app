import {useEffect, useState} from "react";

const BarCard = ({notes = [[]]}) => {
  const [ary, setAry] = useState([]);

  useEffect(() => {
    setAry(notes);
  }, [notes]);

  return (
    <div>
      {ary.map((el, i) => (
        <ul key={i} className="m-1 list-group d-inline-block" style={{width: "25%"}}>
          {el.map((element, idx) => {
            let line = "";
            if (Array.isArray(element)) {
              let beat = element[1] + "";
              if (beat && beat.includes("r")) {
                beat = beat.replace("r", "");
                line = parseInt(beat) == 1 ? element[0] + " 온쉼표" : element[0] + " " + beat + "분쉼표";
              } else {
                line = beat == 1 ? element[0] + " 온음표" : element[0] + " " + beat + "분음표";
              }
            } else line = element + " 4분음표";
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
