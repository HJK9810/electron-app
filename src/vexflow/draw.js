import {Factory} from "vexflow";

const clefAndTimeWidth = 60;
const staveWidth = (700 - clefAndTimeWidth) / 4;

const drawMusicSheet = (ary, id) => {
  const divStave = document.getElementById(id);
  if (divStave.innerHTML) divStave.innerHTML = "";
  const vf = new Factory({renderer: {elementId: id, width: 750, height: 150}});
  let score = vf.EasyScore();
  score.set({time: "4/4"});

  let currX = 0;
  let system = vf.System({x: currX, y: 0, width: staveWidth + clefAndTimeWidth, spaceBetweenStaves: 10});
  ary.forEach((note, i) => {
    if (!i) {
      system
        .addStave({
          voices: [score.voice(score.notes(note))],
        })
        .addClef("treble")
        .addTimeSignature("4/4");

      currX += staveWidth + clefAndTimeWidth;
    } else {
      system = vf.System({x: currX, y: 0, width: staveWidth, spaceBetweenStaves: 10});
      system.addStave({
        voices: [score.voice(score.notes(note))],
      });
      currX += staveWidth;
    }
  });

  vf.draw();
};

export default drawMusicSheet;
