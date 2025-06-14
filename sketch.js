let font;
let letters = "CABF";
let fontSize = 200;
let dots = [];
let loopDuration = 300;

function preload() {
  font = loadFont('NeueHaasGroteskDisplayPro-Roman.ttf'); // Make sure this matches your uploaded font
}

function setup() {
  createCanvas(1000, 400);
  background(255);
  noStroke();
  textSize(fontSize);
  textAlign(CENTER, CENTER);
  textFont(font);
  initDots();
}

function draw() {
  background(255);
  let t = (frameCount % loopDuration) / loopDuration;

  for (let dot of dots) {
    dot.display(t);
  }
}

function initDots() {
  dots = [];
  let spacing = width / (letters.length + 1);

  for (let i = 0; i < letters.length; i++) {
    let char = letters[i];
    let bounds = font.textBounds(char, 0, 0, fontSize);
    let xOffset = spacing * (i + 1) - bounds.w / 2;
    let yOffset = height / 2 + bounds.h / 2;

    let attempts = 0;
    while (attempts < 2000) { // Increased for denser fill
      let x = random(bounds.x, bounds.x + bounds.w);
      let y = random(bounds.y, bounds.y + bounds.h);
      if (isInsideLetter(char, x, y, fontSize)) {
        dots.push(new Dot(x + xOffset, y + yOffset, i * 1000 + attempts));
      }
      attempts++;
    }
  }
}

function isInsideLetter(char, x, y, size) {
  let pts = font.textToPoints(char, 0, 0, size, {
    sampleFactor: 0.5, // Higher detail
    simplifyThreshold: 0
  });
  return collidePointPoly(x, y, pts);
}

class Dot {
  constructor(x, y, seed) {
    this.x = x;
    this.y = y;
    this.baseSize = random(3, 6); // Smaller for clarity
    this.amp = random(1, 3);      // Subtle pulsing
    this.phase = random(TWO_PI);
    this.noiseOffset = random(1000);
  }

  display(t) {
    let size = this.baseSize + this.amp * sin(TWO_PI * t + this.phase);
    let dx = map(noise(this.noiseOffset + t * 2), 0, 1, -0.5, 0.5); // Less jitter
    let dy = map(noise(this.noiseOffset + 100 + t * 2), 0, 1, -0.5, 0.5);
    fill(0);
    ellipse(this.x + dx, this.y + dy, size);
  }
}
