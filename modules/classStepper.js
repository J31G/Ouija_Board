const { Board } = require('johnny-five');

// Setup Board
const board = new Board();

// Current location of pointer on board
let locationX = 0;
let locationY = 0;

// Time to wait between letters
let waitBetweenLetters = 1000;

module.exports.waitBetweenLetters = waitBetweenLetters;

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
        direction: { X: 'left', Y: 'down' },
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

  setWait(wait) {
    waitBetweenLetters = wait;
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
    board.digitalWrite(this?.config?.dirPin?.X, options?.direction?.X === 'left' ? 1 : 0);
    board.digitalWrite(this?.config?.dirPin?.Y, options?.direction?.Y === 'up' ? 1 : 0);

    const stepperX = new Promise((resolve) => {
      let stepCount = 0;

      const id = setInterval(() => {
        // If steps are reached, exit code
        if (stepCount === options?.steps?.X) {
          clearInterval(id);
          setTimeout(() => resolve(this), options?.wait || waitBetweenLetters);
        }

        // Step the stepper
        this.step({ X: 2 });

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

        // Increase out count
        stepCount += 1;
      }, options?.speed?.Y);
    });

    if (options?.steps?.X >= options?.steps?.Y) {
      return stepperX;
    }
    return stepperY;
  }

  letter(data) {
    // the final array of board intructions
    const wordArray = [];

    // Loop through each word and work out what needs to be done
    for (let i = 0; i < data.length; i += 1) {
      const amountLeft = {
        X: { amount: 0, dir: 'right' },
        Y: { amount: 0, dir: 'up' },
      };

      // Work out the X (LEFT/RIGHT)
      if (locationX < data[i].X) {
        amountLeft.X = {
          amount: data[i].X - locationX,
          dir: 'right',
        };
        locationX += amountLeft.X.amount;
      } else if (locationX > data[i].X) {
        amountLeft.X = {
          amount: locationX - data[i].X,
          dir: 'left',
        };
        locationX -= amountLeft.X.amount;
      }

      // Work out the Y (UP/DOWN)
      if (locationY < data[i].Y) {
        amountLeft.Y = {
          amount: data[i].Y - locationY,
          dir: 'up',
        };
        locationY += amountLeft.Y.amount;
      } else if (locationY > data[i].Y) {
        amountLeft.Y = {
          amount: locationY - data[i].Y,
          dir: 'down',
        };
        locationY -= amountLeft.Y.amount;
      }

      // Push into our array
      wordArray.push(amountLeft);
    }
    // TEMP: Work out what is happening
    console.log(wordArray);

    // SEEMS TO BE THE ISSUE!!
    wordArray.forEach((word) => {
      this.move({
        speed: { X: 0, Y: 0 },
        steps: { X: word.X.amount, Y: word.Y.amount },
        direction: { X: word.X.dir, Y: word.Y.dir },
        wait: 2500,
      });
    });

    return this;
  }
};

// Export out board so we can use it in other files
module.exports.board = board;
