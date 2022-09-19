import React, { useRef, useEffect } from "react";
import { Formatter, Renderer, Stave, StaveNote } from "vexflow";

const clefWidth = 30;
const timeWidth = 30;
const beats = [16, 8, 4, 2];
const restSyl = ["b4", "b4", "b4", "c5"];

const fillRestNote = (left) => {
  let rest = [];

  for (let i = 3; i >= 0; i++) {
    rest.unshift(Math.floor(left / (1 / beats[i])));
  }
  return rest;
};

export default function Draw({
  staves = [],
  clef = "treble",
  timeSignature = "4/4",
  width = 750,
  height = 150,
}) {
  const container = useRef();
  const rendererRef = useRef();

  useEffect(() => {
    if (!rendererRef.current) {
      rendererRef.current = new Renderer(
        container.current,
        Renderer.Backends.SVG
      );
    }
    const renderer = rendererRef.current;
    renderer.resize(width, height);
    const context = renderer.getContext();
    context.setFont("Arial", 10);
    const clefAndTimeWidth =
      (clef ? clefWidth : 0) + (timeSignature ? timeWidth : 0);
    const staveWidth = (width - 50 - clefAndTimeWidth) / 4;

    let currX = 0;
    staves.forEach((notes, i) => {
      const stave = new Stave(currX, 0, staveWidth);
      if (!i) {
        stave.setWidth(staveWidth + clefAndTimeWidth);
        clef && stave.addClef(clef);
        timeSignature && stave.addTimeSignature(timeSignature);
      }
      currX += stave.getWidth();
      stave.setContext(context).draw();

      let sum = 0;
      const processedNotes = notes
        .map((note) => (typeof note === "string" ? { key: note } : note))
        .map((note) => {
          if (Array.isArray(note)) {
            sum += 1 / parseInt(note[1]);
            return { key: note[0], duration: note[1] };
          } else {
            sum += 1 / 4;
            return note;
          }
        })
        .map(({ key, ...rest }) =>
          typeof key === "string"
            ? {
                key: key.includes("/") ? key : `${key[0]}/${key.slice(1)}`,
                ...rest,
              }
            : rest
        )
        .map(
          ({ key, keys, duration = "q" }) =>
            new StaveNote({
              keys: key ? [key] : keys,
              duration: duration + "",
            })
        );

      if (1 - sum) {
        fillRestNote(1 - sum).map((el, idx) => {
          for (let index = 0; index < el; index++) {
            processedNotes.add(
              new StaveNote({ keys: [restSyl[idx]], duration: beats[idx] })
            );
          }
        });
      }
      Formatter.FormatAndDraw(context, stave, processedNotes, {
        auto_beam: true,
      });
    });

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
        const note = [new StaveNote({ keys: ["d/5"], duration: "wr" })];
        Formatter.FormatAndDraw(context, stave, note);
      }
    }
  }, [staves]);

  return <div ref={container} />;
}
