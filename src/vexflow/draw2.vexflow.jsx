import React, {useRef, useEffect} from "react";
import {Formatter, Renderer, Stave, StaveNote} from "vexflow";
import data from "./data";

const clefWidth = 30;
const timeWidth = 30;

export default function Draw({index, clef = "treble", timeSignature = "4/4", width = 750, height = 150}) {
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

    let currX = 0;
    data[index] = [];
    for (let i = 0; i < 4; i++) {
      const stave = new Stave(currX, 0, staveWidth);
      if (!i) {
        stave.setWidth(staveWidth + clefAndTimeWidth);
        clef && stave.addClef(clef);
        timeSignature && stave.addTimeSignature(timeSignature);
      }
      currX += stave.getWidth();
      stave.setContext(context).draw();
      const note = [new StaveNote({keys: ["d/5"], duration: "wr"})];
      data[index].push("d5/w/r");
      Formatter.FormatAndDraw(context, stave, note);
    }
  }

  useEffect(() => {
    initialLoad();
  }, []);

  return <div id={"output" + index} ref={container} />;
}
