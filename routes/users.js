const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const config = require('../config/database');

//register route
router.post('/register',(req,res,next)=>{
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser,(error,user)=>{
        if(error){
            res.json({success: false, msg: 'Failed to register user'});
        }else{
            res.json({success: true, msg: 'User registered'});
        }
    });
});

//authentication route
router.post('/authenticate',(req,res,next)=>{
    const username = req.body.username;
    const password = req.body.password;

    //gets the user by username to compare password
    User.getUserByUsername(username,(err,user)=>{
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not founnd'});
        }

        //method that compares passwords 
        User.comparePassword(password, user.password,(err, isMatch)=>{
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({data:user}, config.secret, {
                    expiresIn: 604800 //1 week
                });
                
                jwt.verify(token, config.secret, function(err, data){
                    console.log(err, data);
               });

                res.json({
                    success: true, 
                    token: 'Bearer ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }})
            }else{
                res.json({success: false, msg: 'Wrong Password!'});
            }
        });
    });
});

//profile route
//protect route with passport
router.get('/profile', passport.authenticate('jwt',{session:false}) , (req,res,next)=>{
    res.json({user: req.user});
});


module.exports = router;