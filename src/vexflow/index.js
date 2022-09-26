//THIS IS THE JS
const VF = Vex.Flow;
const divStave = document.getElementById("my-stave");
const renderer = new VF.Renderer(divStave, VF.Renderer.Backends.SVG);
const context = renderer.getContext();
const amountOfBarsPerRow = 4;
var rendererWidth;
var rendererHeight;
const bars = [];
const notesOfBars = []; //In each position it has an array of 4 notes
var currentBar;
var currentNotes; //An array of 4 notes

function divStaveClicked(evt) {
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
  currentNotes[pos] = new VF.StaveNote({
    clef: "treble",
    keys: ["f#/4"],
    duration: "q",
  }).addAccidental(0, new VF.Accidental("#"));

  //- recover and draw all bars and its notes
  for (let barPos = 0; barPos < bars.length; barPos++) {
    let widthAndX = calculateWidthAndX(bars[barPos], bars);
    let heightAndY = calculateHeightAndY(bars[barPos], bars);

    let bar = createBar(barPos, widthAndX, heightAndY);
    if (barPos == bars.length - 1) {
      bar.setEndBarType(Vex.Flow.Barline.type.END); // Last bar
    }
    bar.draw();

    let voice = new VF.Voice({num_beats: 4, beat_value: 4});
    voice.addTickables(notesOfBars[barPos]);
    new VF.Formatter().joinVoices([voice]).format([voice], 350);
    voice.draw(context, bars[barPos]);
  }
}

function calculateWidthAndX(barParam) {
  let previousBar = getPreviousBar(barParam);
  let barPosition = bars.indexOf(previousBar) + 1; //we need +1 because 1st bar is not in array, so it has -1 pos

  //If it's 0 we are in first bar of row, and 1 means the second bar of row
  let widthAndXPosition = Math.floor(barPosition % amountOfBarsPerRow);

  return previousBar == null || widthAndXPosition == 0 ? 10 : previousBar.width + previousBar.x;
}

function calculateHeightAndY(barParam) {
  let previousBar = getPreviousBar(barParam);
  let barPosition = bars.indexOf(previousBar) + 1;

  let heightAndYMultiplier = Math.floor(barPosition / amountOfBarsPerRow);

  return previousBar == null ? 40 : 40 + 100 * heightAndYMultiplier;
}

function getPreviousBar(barParam) {
  let previousBar;
  for (let bar of bars) {
    if (bar === barParam) break;
    previousBar = bar;
  }
  return previousBar;
}

function createBar(barPos, widthAndX, heightAndY) {
  let widthAndXPosition = Math.floor(barPos % amountOfBarsPerRow);

  let bar = new VF.Stave(barPos == 0 ? 10 : widthAndX, barPos == 0 ? 40 : heightAndY, widthAndXPosition == 0 ? 400 : 350).setContext(context);
  if (barPos == 0) bar.addTimeSignature("4/4");
  if (widthAndXPosition == 0) bar.addClef("treble");
  return bar;
}

//Listeners
divStave.addEventListener("click", divStaveClicked);
window.addEventListener("resize", windowSizeChanged);
