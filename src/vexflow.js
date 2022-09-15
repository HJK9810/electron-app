const { Renderer, Stave, StaveNote, Formatter } = require("vexflow");
// import { Renderer, Stave, StaveNote, Formatter } from "./node_modules/vexflow/build/types/entry/vexflow.ts";

// Create an SVG renderer and attach it to the DIV element with id="output".
const div = document.getElementById("output");
const renderer = new Renderer(div, Renderer.Backends.SVG);

// Configure the rendering context.
renderer.resize(750, 500);
const context = renderer.getContext();
context.setFont("Arial", 10);

// Create a stave of width 400 at position 10, 40.
const stave = new Stave(10, 40, 700);

// Add a clef and time signature.
stave.addClef("treble").addTimeSignature("4/4");

// Connect it to the rendering context and draw!
stave.setContext(context).draw();

const notes = [
  new StaveNote({ keys: ["c/4"], duration: "q" }),
  new StaveNote({ keys: ["d/4"], duration: "q" }),
  new StaveNote({ keys: ["b/4"], duration: "qr" }),
  new StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "q" }),
  new StaveNote({ keys: ["b/4"], duration: "q" }),
  new StaveNote({ keys: ["g/4"], duration: "q" }),
  new StaveNote({ keys: ["e/4"], duration: "q" }),
];

// Helper function to justify and draw a 4/4 voice.
Formatter.FormatAndDraw(context, stave, notes);