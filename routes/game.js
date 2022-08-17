const express = require('express');
const router = express.Router();

router.get('/state', (req, res) => {
  res.render('state', {user:req.user});
});

router.get('/nuguri', (req, res) => {
  res.render('nuguri', {user:req.user});
});



module.exports = router;