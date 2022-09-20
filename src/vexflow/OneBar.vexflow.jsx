import {useCallback, useEffect, useState} from "react";

const BarCard = ({notes = [[]]}) => {
  const [ary, setAry] = useState([]);

  const setNotes = useCallback(() => setAry(notes), []);

  useEffect(() => {
    setNotes();
  }, [setNotes]);

  return (
    <div>
      {ary.map((el, i) => (
        <div key={i}>
          {el.map((element) => {
            let line = "";
            if (Array.isArray(element)) {
              if (element[1].includes("r")) {
                line = parseInt(element[1].replace("r", "")) == 1 ? element[0] + " 온쉼표" : element[0] + " " + element[1] + "분쉼표";
              } else {
                line = parseInt(element[1].replace("r", "")) == 1 ? element[0] + " 온음표" : element[0] + " " + element[1] + "분음표";
              }
            } else line = element + " 4분음표";
            return <div>{line}</div>;
          })}
        </div>
      ))}
    </div>
  );
};

export default BarCard;
