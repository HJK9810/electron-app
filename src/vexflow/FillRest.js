import {StaveNote} from "vexflow";

const beats = [16, 8, 4, 2, 1];

function fillNote(left) {
  let rest = [];

  for (let i = 4; i >= 0; i--) {
    const num = Math.floor(left * beats[i]);
    rest.unshift(num);
    left -= num / beats[i];
  }

  return rest;
}

const fillRestNote = (notes) => {
  notes.forEach((note) => {
    let sum = 0;
    const line = note.split(" ");
    for (let i = 0; i < line.length; i++) {
      if (!line[i].includes("r")) {
        const beat = line[i].split("/")[1] == "w" ? 1 : parseInt(line[i].split("/")[1]);
        sum += 1 / beat;
      }
    }
    if (sum != 1) {
      const rest = fillNote(1 - sum);
      rest.map((el, idx) => {
        for (let i = 0; i < el; i++) {
          if (idx == 4) continue;
          note += " b4/" + beats[i];
        }
      });
    }
  });

  return notes;
};

export default fillRestNote;
