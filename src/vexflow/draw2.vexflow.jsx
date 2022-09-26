import React, {useRef, useEffect} from "react";
import {Formatter, Renderer, Stave, StaveNote, Voice, Accidental} from "vexflow";
import fillRestNote from "./FillRest";
import {calculateWidthAndX, calculateHeightAndY} from "./draw";

const clefWidth = 30;
const timeWidth = 30;

export default function Draw({staves = [], clef = "treble", timeSignature = "4/4", width = 750, height = 150}) {
  const container = useRef();
  const rendererRef = useRef();
  staves = fillRestNote(staves);

  useEffect(() => {
    if (!rendererRef.current) {
      rendererRef.current = new Renderer(container.current, Renderer.Backends.SVG);
    }
    let renderer = rendererRef.current;
    renderer.resize(width, height);
    const context = renderer.getContext();
    context.setFont("Arial", 10);
    const clefAndTimeWidth = (clef ? clefWidth : 0) + (timeSignature ? timeWidth : 0);
    const staveWidth = (width - 50 - clefAndTimeWidth) / 4;

    let currX = 0;
    if (staves.length != 4) {
      for (let i = 0; i < 4 - staves.length; i++) {
        const stave = new Stave(currX, 0, staveWidth);
        if (!i && !staves.length) {
          stave.setWidth(staveWidth + clefAndTimeWidth);
          clef && stave.addClef(clef);
          timeSignature && stave.addTimeSignature(timeSignature);
        }
        currX += stave.getWidth();
        stave.setContext(context).draw();
        const note = [new StaveNote({keys: ["d/5"], duration: "wr"})];
        Formatter.FormatAndDraw(context, stave, note);
      }
    }
  }, [staves]);

  const divStaveClicked = (evt) => {
    //- clear context: this removes previous notes and staves
    context.clear();
    // context.rect(10, 40, rendererWidth, rendererHeight, { stroke: 'none', fill: 'white' });

    //- we put a note in current bar
    let pos;
    for (let notePos = 0; notePos < currentNotes.length; notePos++) {
      if (currentNotes[notePos].customTypes[0] === "r") {
        pos = notePos;
        break;
      }
    }
    currentNotes[pos] = new StaveNote({
      clef: "treble",
      keys: ["f#/4"],
      duration: "q",
    }).addAccidental(0, new Accidental("#"));

    //- recover and draw all bars and its notes
    for (let barPos = 0; barPos < bars.length; barPos++) {
      let widthAndX = calculateWidthAndX(bars[barPos], bars);
      let heightAndY = calculateHeightAndY(bars[barPos], bars);

      let bar = createBar(barPos, widthAndX, heightAndY);
      if (barPos == bars.length - 1) {
        bar.setEndBarType(Vex.Flow.Barline.type.END); // Last bar
      }
      bar.draw();

      let voice = new Voice({num_beats: 4, beat_value: 4});
      voice.addTickables(notesOfBars[barPos]);
      new Formatter().joinVoices([voice]).format([voice], 350);
      voice.draw(context, bars[barPos]);
    }
  };

  const createBar = (barPos, widthAndX, heightAndY) => {
    let widthAndXPosition = Math.floor(barPos % amountOfBarsPerRow);

    let bar = new Stave(barPos == 0 ? 10 : widthAndX, barPos == 0 ? 40 : heightAndY, widthAndXPosition == 0 ? 400 : 350).setContext(context);
    if (barPos == 0) bar.addTimeSignature("4/4");
    if (widthAndXPosition == 0) bar.addClef("treble");
    return bar;
  };

  return <div ref={container} />;
}
