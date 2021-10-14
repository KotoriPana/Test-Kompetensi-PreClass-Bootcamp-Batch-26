let display = "";

function drawSikuSiku(row) {
  let i = 1;

  for (let a = 1; a <= row; a++) {
    for (let b = 1; b <= a; b++) {
      display += `${i++} `;
    }
    display += "\n";
  }
}

drawSikuSiku(10);

console.log(display);
