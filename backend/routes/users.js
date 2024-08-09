const express = require("express");
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const User = require("../models/user");

const router = express.Router();

router.post("/signup",(req, res, next) => {
    bcrypt.hash(req.body.password,10)
    .then(hashedPass =>{
      const user= new User({
        email: req.body.email,
        password: hashedPass
      })
      user.save()
      .then( result => {
        res.status(201).json({
          message: 'user added',
          result:result
        })
      })
      .catch( err =>{
        res.status(500).json({
          error: err
        })
      })
    })
  }
);

router.post("/login", (req,res,next) => {
  let fetchedUser;
  User.find({email: req.body.email})
  .then( user =>{
    if(!user){
      return res.status(404).json({
        message: "Authentication failed"
      })
    }
    fetchedUser=user;
    return bcrypt.compare(req.body.password,user[0].password)
  })
  .then( response =>{
    if(!response){
      return res.status(401).json({
        message: "Authentication failed"
      })
    }
    const token = jwt.sign({email: fetchedUser[0].email, user_id: fetchedUser[0]._id}, 'secret_this_should_be_longer', {expiresIn:'1h'})
    res.status(200).json({
      token: token
    })
  })
  .catch(err=>{
    res.status(401).json({
      error: err
    })
  })
})


module.exports = router;