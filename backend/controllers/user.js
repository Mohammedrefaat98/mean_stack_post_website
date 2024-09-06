const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const User = require("../models/user");

exports.createUser=(req, res, next) => {
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
            message: "Invalid authentication credentials!"
        })
        })
    })
}

exports.login=(req,res,next) => {
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
    const token = jwt.sign(
      {
        email: fetchedUser[0].email,
        user_id: fetchedUser[0]._id
      },
      process.env.JWT_KEY,
      {expiresIn:'1h'}
    )
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser[0]._id
    })
  })
  .catch(err=>{
    res.status(401).json({
      message: 'Invalid authentication credentials!'
    })
  })
}
