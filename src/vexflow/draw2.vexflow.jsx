import React, {useRef, useEffect} from "react";
import {Formatter, Renderer, Stave, StaveNote, Voice, Accidental, Barline} from "vexflow";
import fillRestNote from "./FillRest";
import {data, bars, notesOfBars} from "./data";
import {calculateWidthAndX, calculateHeightAndY} from "./draw";

const clefWidth = 30;
const timeWidth = 30;

export default function Draw({staves = [], index, clef = "treble", timeSignature = "4/4", width = 750, height = 150}) {
  const container = useRef();
  const rendererRef = useRef();
  let renderer;
  let context;

  function initialLoad() {
    if (!rendererRef.current) {
      rendererRef.current = new Renderer(container.current, Renderer.Backends.SVG);
    }
    renderer = rendererRef.current;
    renderer.resize(width, height);
    context = renderer.getContext();
    context.setFont("Arial", 10);
    const clefAndTimeWidth = (clef ? clefWidth : 0) + (timeSignature ? timeWidth : 0);
    const staveWidth = (width - 50 - clefAndTimeWidth) / 4;

    //Create a first bar full of silences
    createNewBarFullOfSilences(0);
  }

  function createNewBarFullOfSilences(barPos) {
    let widthAndX = calculateWidthAndX(bars[barPos], bars);
    let heightAndY = calculateHeightAndY(bars[barPos], bars);
    //
    // rendererWidth = calculateRendererWidth(); //TODO
    // rendererHeight = calculateRendererHeight();
    let newBar = createBar(barPos, widthAndX, heightAndY).draw();
    bars[barPos] = newBar;

    notesOfBars[barPos] = [
      new StaveNote({clef: "treble", keys: ["b/4"], duration: "qr"}),
      new StaveNote({clef: "treble", keys: ["b/4"], duration: "qr"}),
      new StaveNote({clef: "treble", keys: ["b/4"], duration: "qr"}),
      new StaveNote({clef: "treble", keys: ["b/4"], duration: "qr"}),
    ];

    let voice = new Voice({num_beats: 4, beat_value: 4});
    voice.addTickables(notesOfBars[barPos]);
    new Formatter().joinVoices([voice]).format([voice], 350);
    voice.draw(context, bars[barPos]);
  }

  const createBar = (barPos, widthAndX, heightAndY) => {
    let widthAndXPosition = Math.floor(barPos % 4);

    let bar = new Stave(barPos == 0 ? 10 : widthAndX, barPos == 0 ? 40 : heightAndY, widthAndXPosition == 0 ? 400 : 350).setContext(context);
    if (barPos == 0) bar.addTimeSignature("4/4");
    if (widthAndXPosition == 0) bar.addClef("treble");
    return bar;
  };

  useEffect(() => {
    initialLoad();
  }, [staves]);

  return <div id={"output" + index} ref={container} />;
}
