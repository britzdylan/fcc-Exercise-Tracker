'use strict';
const express = require('express')
const router = express.Router()

//pass in models
const User = require('../models/user')

let user = {}

// create new user
router.post('/new-user', async (req, res) => {
user = await new User();
user.username = req.body.username
try {
  user = await user.save()
  res.json({
    'username' : user.username,
    '_id' : user._id
  })
} catch (e) {
  console.log(e) //log the error
}

})

//get all users
router.get('/users', async (req, res) => {
  const users = await User.find();
  const userObject = await users.map(user => ({
    'username' : user.username, '_id' : user._id
  }))
  res.json(userObject)
})

//add exercise
router.post('/add', async (req,res) => {
  let user = await User.findById(req.body.userId)
  const exercise = {}
  exercise.description = req.body.description
  exercise.duration = req.body.duration
  exercise.date = req.body.date != "" ? new Date(req.body.date) : new Date()
  try {
    user.exercises.push(exercise);
    user = await user.save()
    //const updatedUser = await User.findById(req.body.userId)
    res.json({
    "_id": user._id,
    "username": user.username,
    "date": exercise.date.toDateString(),
    "duration": Number(exercise.duration),
    "description": exercise.description
    })
  } catch (e) {
    console.log(e)
  } 
})


// full exercise log
 router.get('/log' , async (req,res) => {

   if(req.query.userId === undefined) {
     res.send('Unknown userId')
   }

  const user = await User.findById(req.query.userId)
  const limit = req.query.limit != undefined ? req.query.limit : user.exercises.length
  const params = { 'fromDate' : req.query.from, 'toDate' : req.query.to }
  const exercise = [];


  try {
      for (let i = 0; i < limit; i++) {
          await exercise.push(
            {
              "description": user.exercises[i].description,
              "duration": user.exercises[i].duration,
              "date": user.exercises[i].date.toDateString()
            });
        }

        const finalLog = await filterLog(exercise, params)
        console.log(finalLog, exercise)
        if (finalLog.length > 0) {
          res.json({
            '_id' : user._id,
            'username' : user.username,
            'count' : user.exercises.length,
            'log' : finalLog
            })
        } else {
          res.send('Unknown userId')
        }
  } catch (e) {
    console.log(e)
  }
})

async function filterLog(log, params) {
  if (!params.fromDate || !params.toDate) {
    return log
  }

  var fromDate = new Date(params.fromDate)
  var toDate = new Date(params.toDate)

  let sortedExercises = log.sort((a,b) => a.date - b.date)
  
  sortedExercises = await sortedExercises.filter(function(obj){
     console.log(typeof obj.date)
    return new Date(obj.date) >= fromDate &&  new Date(obj.date) <= toDate
  })
  return sortedExercises;
}


module.exports = router;