const express = require('express');
const router = express.Router();
const currPath = '';

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('/game/state, Time: ', Date.now(),'/req.user', req.user);

  if(!global.checkLogin(req)) {
    res.redirect('/auth/login');
  }
  else {
    next();
  }
});


router.get('/state', (req, res) => {
  res.render('state', {user:req.user});
});

router.get('/nuguri', (req, res) => {
  res.render('nuguri', {user:req.user});
});



module.exports = router;