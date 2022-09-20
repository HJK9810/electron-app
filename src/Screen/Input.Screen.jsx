import InputBtn from "../vexflow/input.vexflow";
import BarCard from "../vexflow/OneBar.vexflow";
import data from "../vexflow/data";

const InputS = (index) => {
  return (
    <>
      <InputBtn />
      <BarCard notes={data[index]} />
    </>
  );
};

export default InputS;
