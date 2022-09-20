import InputBtn from "../vexflow/input.vexflow";
import BarCard from "../vexflow/OneBar.vexflow";

const InputS = (index) => {
  return (
    <>
      <InputBtn />
      <BarCard index={index} />
    </>
  );
};

export default InputS;
