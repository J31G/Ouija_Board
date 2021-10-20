const express = require('express');

const { getCharacters, getDelay } = require('../modules/dbQueries');
const stepper = require('../modules/stepper');

const router = express.Router();

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

router.post('/init', checkAuth, async (req, res) => {
  await stepper.move({
    X: { dir: 1, steps: 37000 },
    Y: { dir: 0, steps: 22000 },
  });
  stepper.reset();
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
  const decodedWord = stepper.letter(charArray);

  let i = 0;
  let running = false;

  const id = setInterval(async () => {
    // If word is complete, exit
    if (i === decodedWord.length - 1) clearInterval(id);

    // If board is still running, ignore
    if (running) return;

    // Set out board as running
    running = true;

    // Get letter delay from DB
    const letterDelay = await getDelay();

    // Move our steppers to letter
    stepper.move({
      X: { dir: decodedWord[i].X.dir, steps: decodedWord[i].X.amount },
      Y: { dir: decodedWord[i].Y.dir, steps: decodedWord[i].Y.amount },
    }).then(() => {
      // Once completed letter, wait ${letterDelay} secs then move to next one
      setTimeout(() => {
        i += 1;
        running = false;
      }, letterDelay[0].VALUE);
    });
  }, 1000);

  // 200: Word processed
  sendStatus(res, 200, 'Success');
});

module.exports = router;
