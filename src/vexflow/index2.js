//THIS IS THE JS
const VF = Vex.Flow;
const divStave = document.getElementById("my-stave");
const renderer = new VF.Renderer(divStave, VF.Renderer.Backends.SVG);
const context = renderer.getContext();
var amountOfBarsPerRow;
var rendererWidth;
var rendererHeight;
const bars = [];
const notesOfBars = []; //In each position it has an array of 4 notes
var currentBar;
var currentNotes; //An array of 4 notes

function initialLoad() {
  rendererWidth = 10000;
  rendererHeight = 10000;
  amountOfBarsPerRow = 2;
  renderer.resize(rendererWidth, rendererHeight);
  //Create a first bar full of silences
  createNewBarFullOfSilences(0);
  currentBar = bars[0];
  currentNotes = notesOfBars[0];
}

function divStaveClicked(evt) {
  //- clear context: this removes previous notes and staves
  context.clear();
  // context.rect(10, 40, rendererWidth, rendererHeight, { stroke: 'none', fill: 'white' });

  //- we put a note in current bar
  addOneNoteToCurrentNotes();

  //- if last bar has 1 note and 3 silences
  // then we create another bar (with 4 silences)
  if (barHasExactlyOneNote(bars.length - 1)) {
    createNewBarFullOfSilences(bars.length);
    renderer.resize(rendererWidth, rendererHeight);
  } else if (hasCurrentBarFourNotes()) {
    //- we have a new bar
    currentBar = bars[bars.length - 1];
    currentNotes = notesOfBars[bars.length - 1];
  }

  //- recover and draw all bars and its notes
  recoverAndDrawBars();
}

function windowSizeChanged(evt) {
  // I need something to remove notes too, not just stave like in next line
  // context.clear();
  context.rect(10, 40, rendererWidth, rendererHeight, {stroke: "none", fill: "white"});

  changeAmountOfBarsPerRowRegardingScreenWidth();

  recoverAndDrawBars();

  recalculatePositionNotes();
}

function createNewBarFullOfSilences(barPos) {
  let widthAndX = calculateWidthAndX();
  let heightAndY = calculateHeightAndY();
  //
  // rendererWidth = calculateRendererWidth(); //TODO
  // rendererHeight = calculateRendererHeight();
  let newBar = createBar(barPos, widthAndX, heightAndY).setEndBarType(Vex.Flow.Barline.type.END).draw();
  bars[barPos] = newBar;

  notesOfBars[barPos] = [
    new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr"}),
    new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr"}),
    new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr"}),
    new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr"}),
  ];

  let voice = new VF.Voice({num_beats: 4, beat_value: 4});
  voice.addTickables(notesOfBars[barPos]);
  new VF.Formatter().joinVoices([voice]).format([voice], 350);
  voice.draw(context, bars[barPos]);
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

function addOneNoteToCurrentNotes() {
  let pos = findPositionOfFirstSilenceNote();
  currentNotes[pos] = new VF.StaveNote({
    clef: "treble",
    keys: ["f#/4"],
    duration: "q",
  }).addAccidental(0, new VF.Accidental("#"));
}

function findPositionOfFirstSilenceNote() {
  for (let notePos = 0; notePos < currentNotes.length; notePos++) {
    if (currentNotes[notePos].customTypes[0] === "r") {
      return notePos;
    }
  }
}

function recoverAndDrawBars() {
  for (let barPos = 0; barPos < bars.length; barPos++) {
    let widthAndX = calculateWidthAndX(bars[barPos]);
    let heightAndY = calculateHeightAndY(bars[barPos]);

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

function recalculatePositionNotes() {}

function barHasExactlyOneNote(pos) {
  // 1 note & 3 silences: if note.customTypes[0] == "r": it is a silence
  return notesOfBars[pos][0].customTypes[0] !== "r" && notesOfBars[pos][1].customTypes[0] === "r" && notesOfBars[pos][2].customTypes[0] === "r" && notesOfBars[pos][3].customTypes[0] === "r";
}

function hasCurrentBarFourNotes() {
  currentBarPos = getCurrentBarPos();
  return (
    notesOfBars[currentBarPos][0].customTypes[0] !== "r" &&
    notesOfBars[currentBarPos][1].customTypes[0] !== "r" &&
    notesOfBars[currentBarPos][2].customTypes[0] !== "r" &&
    notesOfBars[currentBarPos][3].customTypes[0] !== "r"
  );
}

function getCurrentBarPos() {
  for (let barPos = 0; barPos < bars.length; barPos++) {
    if (bars[barPos] === currentBar) {
      return barPos;
    }
  }
}

function changeAmountOfBarsPerRowRegardingScreenWidth() {
  let screenWidth = window.innerWidth;

  let screenWidthRemaining = screenWidth - 440; //1 row
  amountOfBarsPerRow = 1;

  while (true) {
    //For each 350 px reamining add 1 row
    screenWidthRemaining -= 350;
    if (screenWidthRemaining < 0) break;
    amountOfBarsPerRow++;
  }
}

//Listeners
divStave.addEventListener("click", divStaveClicked);
window.addEventListener("resize", windowSizeChanged);

initialLoad();
