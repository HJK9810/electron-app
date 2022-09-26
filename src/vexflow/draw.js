const amountOfBarsPerRow = 4;

export function calculateWidthAndX(barParam, bars) {
  let previousBar = getPreviousBar(barParam, bars);
  let barPosition = bars.indexOf(previousBar) + 1; //we need +1 because 1st bar is not in array, so it has -1 pos

  //If it's 0 we are in first bar of row, and 1 means the second bar of row
  let widthAndXPosition = Math.floor(barPosition % amountOfBarsPerRow);

  return previousBar == null || widthAndXPosition == 0 ? 10 : previousBar.width + previousBar.x;
}

export function calculateHeightAndY(barParam, bars) {
  let previousBar = getPreviousBar(barParam, bars);
  let barPosition = bars.indexOf(previousBar) + 1;

  let heightAndYMultiplier = Math.floor(barPosition / amountOfBarsPerRow);

  return previousBar == null ? 40 : 40 + 100 * heightAndYMultiplier;
}

function getPreviousBar(barParam, bars) {
  let previousBar;
  for (let bar of bars) {
    if (bar === barParam) break;
    previousBar = bar;
  }
  return previousBar;
}
