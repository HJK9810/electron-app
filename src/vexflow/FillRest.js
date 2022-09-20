const beats = [16, 8, 4, 2];

function fillNote(left) {
  let rest = [];

  for (let i = 3; i >= 0; i--) {
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
      if (Array.isArray(note[i])) {
        note[i][1].includes("r") ? (sum += 1 / parseInt(note[i][1].replace("r", ""))) : (sum += 1 / note[i][1]);
      } else sum += 1 / 4;
    }
    if (sum != 1) {
      const rest = fillNote(1 - sum);
      rest.map((el, idx) => {
        for (let i = 0; i < el; i++) {
          note.push(["b4", beats[idx] + "r"]);
        }
      });
    }
  });

  return notes;
};

export default fillRestNote;
