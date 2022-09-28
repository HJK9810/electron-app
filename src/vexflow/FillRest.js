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
    for (let i = 0; i < note.length; i++) {
      if (note[i].customTypes[0] !== "r") {
        const beat = note[i].duration == "w" ? 1 : parseInt(note[i].duration);
        sum += 1 / beat;
      }
    }
    if (sum != 1) {
      const rest = fillNote(1 - sum);
      rest.map((el, idx) => {
        for (let i = 0; i < el; i++) {
          if (idx == 4) continue;
          note.push(
            new StaveNote({
              keys: ["b/4"],
              duration: beats[idx],
            })
          );
        }
      });
    }
  });

  return notes;
};

export default fillRestNote;
