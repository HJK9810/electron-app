import { useEffect, useState } from "react";
import data from "./data";

const BarCard = (index) => {
  const [ary, setAry] = useState([]);

  useEffect(() => (data[index] ? setAry(data[index]) : setAry([])), []);

  return (
    <div>
      {ary.map((el) => (
        <div>
          {el.map((element) => (
            <div>
              {Array.isArray(element) ? element[0] + " " + element[1] + "분음표" : element + " 4분음표"}
              <button>X</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BarCard;
