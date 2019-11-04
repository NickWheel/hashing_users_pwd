const express = require('express');
const router = express.Router();
const Ajv = require('ajv');
const ajv = new Ajv();
const usersSchema = require('../schemas/userSchema');
const UserModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// main page route
router.get('/', function(req, res, next) {
  UserModel.find()
  .then(data=>{
    res.render('index', {users: data});
  })
  .catch(err=>{if(err) throw err});
});

// LOGIN route
router.post('/login', (req,res)=>{
  const lUser = {
    login: req.body.login,
    pwd: req.body.pwd
  };
  // looking for a loginning user in DB
  UserModel.findOne({login: lUser.login})
  .then((data)=>{
    let hash = data.pwd;
    bcrypt.compare(lUser.pwd, hash, function(err, result) {
      if(result) {
        res.cookie('hash', `${hash.match(/.{1,5}/)}`).cookie('login', `${lUser.login}`)
        .end('You are logged in!');
      }else {
        res.send('Login or password is incorrect!');
      }
  
    });
  })
  .catch(err=>{if(err) throw err});
  
});

// REGISTRATION route
router.post('/', (req,res)=>{
  // validation
  const validate = ajv.compile(usersSchema);
  const valid = validate(req.body);
  console.log('VALIDATION: '+valid);

  if (!valid) {
    const { errors } = validate;
    const result = {
      status: 'you are invalid',
    };
    console.log(errors);
    res.json(result);
  }
  // if new user passed validation, he will be saved in DB
  else {
    // hashing the pwd 
    bcrypt.hash(req.body.pwd, saltRounds, function(err, hash) {
      const new_user = new UserModel({
        mail: req.body.mail,
        name: req.body.name,
        surname: req.body.surname,
        login: req.body.login,
        pwd: hash,
        dob: req.body.dob,
        phone: req.body.phone,
      });
      new_user.save();
    });
    res.redirect('/');
  }
})

module.exports = router;
