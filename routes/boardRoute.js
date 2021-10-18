const express = require('express');

const { getCharacters } = require('../modules/dbQueries');
const { Stepper, board } = require('../modules/classStepper');

const router = express.Router();

// setup new stepper
const stepper = new Stepper({
  stepPin: { X: 2, Y: 3 },
  dirPin: { X: 5, Y: 6 },
  stepsPerRev: { X: 3600, Y: 3600 },
});

// Helper Function
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};
const sendStatus = (res, statusCode, statusMessage) => {
  res.status(statusCode);
  res.send({
    statusCode,
    statusMessage,
  });
};

board.on('ready', () => {
  // BOARD INIT
  router.post('/init', checkAuth, async (req, res) => {
    await stepper.init();
    sendStatus(res, 200, 'Success');
  });

  // Word handler
  router.post('/word', checkAuth, async (req, res) => {
    // Make array out of word
    const wordArray = Array.from(req?.body?.word.toLowerCase());

    // Get list db entries for matches
    const allCharacters = await getCharacters();

    const charArray = [];

    wordArray.forEach(async (char) => {
      // Find letter in DB
      const letter = allCharacters.find((l) => l.CHARACTER === char);

      // Add to array
      charArray.push(letter);
    });

    // Send to stepper
    stepper.letter(charArray);

    // 200: Word processed
    sendStatus(res, 200, 'Success');
  });
});

module.exports = router;
