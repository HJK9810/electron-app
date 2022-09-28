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
  const result = [];
  notes.map((note) => {
    let sum = 0;
    const line = note.trim().split(",");
    for (let i = 0; i < line.length; i++) {
      const beat = line[i].split("/")[1] == "w" ? 1 : parseInt(line[i].split("/")[1]);
      sum += 1 / beat;
    }
    if (sum != 1) {
      const rest = fillNote(1 - sum);
      rest.map((el, idx) => {
        for (let i = 0; i < el; i++) {
          if (idx == 4) continue;
          note += ", b4/" + beats[idx] + "/r";
        }
      });
    }
    result.push(note);
  });

  return result;
};

export default fillRestNote;
