var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/secret', function(req, res, next) {
  res.send('YOU HAVE A SECRET COOKIE !!!!!!');
});

router.get('/unlogin', (req,res)=>{
  res.send('OMMNOMNOMNOMNOMNOM');
})

module.exports = router;
