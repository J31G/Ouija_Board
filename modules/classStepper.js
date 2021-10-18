const { Board } = require('johnny-five');

const board = new Board();

// Current location of pointer on board
let locationX = null;
let locationY = null;

module.exports.Stepper = class Stepper {
  constructor(config) {
    this.config = config;
  }

  init() {
    const initProcess = new Promise((resolve) => {
      // Set step and dir pins to output
      board.pinMode(this?.config?.stepPin?.X, board.MODES.OUTPUT);
      board.pinMode(this?.config?.stepPin?.Y, board.MODES.OUTPUT);
      board.pinMode(this?.config?.dirPin?.X, board.MODES.OUTPUT);
      board.pinMode(this?.config?.dirPin?.Y, board.MODES.OUTPUT);

      // Board to X: 0, Y: 0
      this.move({
        speed: { X: 0, Y: 0 },
        steps: { X: 18560, Y: 11392 },
        direction: { X: 'down', Y: 'left' },
        wait: 5000,
      }).then(() => {
        this.setZero();
        console.log('Reset', `X: ${locationX} | Y: ${locationY}`);
        resolve(this);
      });
    });

    return initProcess;
  }

  setZero() {
    locationX = 0;
    locationY = 0;
    return this;
  }

  location() {
    console.log(`Location: X = ${locationX} | Y = ${locationY}`);
    return this;
  }

  step(amount) {
    // X
    for (let i = 0; i < amount?.X; i += 1) {
      board.digitalWrite(this?.config?.stepPin?.X, board.pins[this?.config?.stepPin?.X].value
        ? 0 : 1);
    }
    // Y
    for (let j = 0; j < amount?.Y; j += 1) {
      board.digitalWrite(this?.config?.stepPin?.Y, board.pins[this?.config?.stepPin?.Y].value
        ? 0 : 1);
    }

    return this;
  }

  move(options) {
    // Set direction
    board.digitalWrite(this?.config?.dirPin?.X, options?.direction?.X === 'up' ? 1 : 0);
    board.digitalWrite(this?.config?.dirPin?.Y, options?.direction?.Y === 'right' ? 1 : 0);

    const stepperX = new Promise((resolve) => {
      let stepCount = 0;

      const id = setInterval(() => {
        // If steps are reached, exit code
        if (stepCount === options?.steps?.X) {
          clearInterval(id);
          setTimeout(() => resolve(this), options?.wait);
        }

        // Step the stepper
        this.step({ X: 2 });

        // Set location X
        if (options?.direction?.X === 'up') {
          locationX += 1;
        } else locationX -= 1;

        // TEMP: Log out which step we are on
        // console.log(`X: ${locationX}`);

        // Increase out count
        stepCount += 1;
      }, options?.speed?.X);
    });

    const stepperY = new Promise((resolve) => {
      let stepCount = 0;

      const id = setInterval(() => {
        // If steps are reached, exit code
        if (stepCount === options?.steps?.Y) {
          clearInterval(id);
          setTimeout(() => resolve(this), options?.wait);
        }

        // Step the stepper
        this.step({ Y: 2 });

        // Set location Y
        if (options?.direction?.Y === 'right') {
          locationY += 1;
        } else locationY -= 1;

        // TEMP: Log out which step we are on
        // console.log(`Y: ${locationY}`);

        // Increase out count
        stepCount += 1;
      }, options?.speed?.Y);
    });

    if (options?.steps?.X >= options?.steps?.Y) {
      return stepperX;
    }
    return stepperY;
  }
};

// Export out board so we can use it in other files
module.exports.board = board;
