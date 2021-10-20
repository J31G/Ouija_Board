const { Board, Stepper } = require('johnny-five');

const board = new Board();

// Current location of pointer on board
let locationX = 0;
let locationY = 0;

board.on('ready', () => {
  // Setup stepper Y
  const stepperY = new Stepper({
    type: Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: [3, 6],
  });

  // Setup stepper X
  const stepperX = new Stepper({
    type: Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: [2, 5],
  });

  module.exports.reset = () => {
    locationX = 0;
    locationY = 0;
    console.log('X & Y Reset');
  };

  module.exports.move = (options) => {
    const running = new Promise((resolve) => {
      let bothComplete = 0;
      const done = () => {
        bothComplete += 1;
        console.log(bothComplete);
        if (bothComplete === 2) {
          console.log('Word done');
          resolve();
        }
      };

      stepperY.step({
        steps: Math.round(options?.Y?.steps || 0),
        direction: options?.Y?.dir,
        rpm: 180,
        accel: Math.round(options?.Y?.steps / 2),
        decel: Math.round(options?.Y?.steps / 2),
      }, () => done());

      stepperX.step({
        steps: options?.X?.steps || 0,
        direction: options?.X?.dir,
        rpm: 180,
        accel: Math.round(options?.X?.steps / 2),
        decel: Math.round(options?.X?.steps / 2),
      }, () => done());
    });
    return running;
  };

  module.exports.letter = (data) => {
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
          dir: 0,
        };
        locationX += amountLeft.X.amount;
      } else if (locationX > data[i].X) {
        amountLeft.X = {
          amount: locationX - data[i].X,
          dir: 1,
        };
        locationX -= amountLeft.X.amount;
      }

      // Work out the Y (UP/DOWN)
      if (locationY < data[i].Y) {
        amountLeft.Y = {
          amount: data[i].Y - locationY,
          dir: 1,
        };
        locationY += amountLeft.Y.amount;
      } else if (locationY > data[i].Y) {
        amountLeft.Y = {
          amount: locationY - data[i].Y,
          dir: 0,
        };
        locationY -= amountLeft.Y.amount;
      }

      // Push into our array
      wordArray.push(amountLeft);
    }
    // return array
    return wordArray;
  };
});
