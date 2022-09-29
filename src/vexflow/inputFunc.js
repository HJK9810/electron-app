import data from "./data";
import fillRestNote from "./FillRest";

const findPosition = (ary) => {
  let count = 0;
  for (let i = 0; i < ary.length; i++) {
    const line = ary[i].trim().split(",");
    for (let j = 0; j < line.length; j++) {
      if (parseInt(sepearID[1]) == count) {
        return [i, j];
      } else count++;
    }
  }
};

// for note update
export const forUpdate = (sepearID, sylChage, beat, scale, checked) => {
  let currentNotes = [...data[parseInt(sepearID[0].replace("output", ""))]];
  const position = findPosition(fillRestNote(currentNotes));
  const line = currentNotes[position[0]].trim().split(",");

  let sum = 0;
  for (let i = 0; i < line.length; i++) {
    if (i == position[1]) continue;
    const ary = line[i].split("/");
    sum += 1 / parseInt(ary[1]);
  }
  if (sum + 1 / parseInt(beat) <= 1) {
    line[position[1]] = checked ? "b4/" + beat + "/r" : sylChage + scale + "/" + beat;
  } else if (sum != 1 && sum + 1 / parseInt(beat) > 1) return ""; // roop out and need beat change

  currentNotes[position[0]] = line.join(", ");
  return currentNotes;
};

export const forDataDel = (sepearID) => {
  let currentNotes = [...data[parseInt(sepearID[0].replace("output", ""))]];
  const position = findPosition(fillRestNote(currentNotes));
  const line = currentNotes[position[0]].trim().split(",");
  line = line.splice(position[1], 1);
  currentNotes[position[0]] = line.join(", ");

  return currentNotes;
};

// for input new note
export const forDataIn = (currentNotes, sylChage, beat, scale, checked) => {
  let out = false;
  for (let notePos = 0; notePos < currentNotes.length; notePos++) {
    if (currentNotes[notePos].includes("w") && (notePos == 0 || !out)) {
      currentNotes[notePos] = sylChage + scale + "/" + beat;
      out = true;
    } else {
      const line = currentNotes[notePos].trim().split(",");

      let sum = 0;
      for (let i = 0; i < line.length; i++) {
        const ary = line[i].split("/");
        sum += 1 / parseInt(ary[1]);
      }
      if (sum + 1 / parseInt(beat) <= 1) {
        checked ? line.push("b4/" + beat + "/r") : line.push(sylChage + scale + "/" + beat);
        out = true;
      } else if (sum != 1 && sum + 1 / parseInt(beat) > 1) return ""; // roop out and need beat change

      currentNotes[notePos] = line.join(", ");
    }
    if (out) return currentNotes;
  }
};
