const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  if(global.debug) {
    next();
  }
  else {
    console.log('/game/state, Time: ', Date.now(),'/req.user', req.user);
  
    if(!global.checkLogin(req)) {
      console.log('/game', 'login disconnected');
      res.redirect('/auth/login');
    }
    else {
      console.log('/game', 'login connected');
      next();
    }
  }
});


router.get('/state', (req, res) => {
  res.render('state', {user:req.user});
});

router.get('/nuguri', (req, res) => {
  res.render('nuguri', {user:req.user});
});



module.exports = router;