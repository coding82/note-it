const router = require('express').Router()
const {User} = require('../db/models')
const Sequelize = require('sequelize')
module.exports = router


// GET - all users

router.get('/', (req, res, next) => {
  return User.findAll()
    .then( users => res.json(users).status(200))
    .catch(next)
})

// GET - single user

router.get('/:id',(req, res, next) => {
  return User.findById(req.params.id)
    .then( user => res.json(user).status(200))
    .catch(next)
})

// POST - new user

router.post('/', (req, res, next) => {
  return User.create(req.body)
    .then( user => res.status(201).json(user) )
    .catch(next)
})

// PUT - add a post to the user

router.put('/:id/posts', (req, res, next) => {
  // req.body.content
  return User.update({'posts': Sequelize.fn('array_append', Sequelize.col('posts'), req.body.content)}, { where: {id: req.params.id}, returning: true})
    .then(([_, updated]) => res.status(201).json(updated[0]))
    .catch(next)
})

////// DELETE ONE //////
//PUT - delete single post

router.put('/:id/posts/movetotrash', (req, res, next) => {
  // put input - req.body.id
  return User.findById(req.params.id)
    .then( user => {
      let outItem = user.posts.splice( +req.body.id, 1)
      let leftItems = user.posts;
              User.update(
                {'trash': Sequelize.fn('array_append', Sequelize.col('trash'), outItem[0])},
                {where: {id: req.params.id},
                returning: true})
       return User.update(
                {'posts': leftItems},
                {where: {id: req.params.id},
                returning: true})
        .then(([_, updated]) => res.status(201).json(updated[0]))
    })
    .catch(next)
})


////// DELETE ALL //////
// PUT - Empty the posts array

router.put('/:id/emptyposts', (req, res, next) => {
  return User.update({'posts': [] }, {where: {id: req.params.id}, returning: true})
    .then(([_, updated]) => res.status(201).json(updated[0]))
    .catch(next)
})

////// DELETE ALL //////
// PUT - Empty the trash array

router.put('/:id/emptytrash', (req, res, next) => {
  return User.update({'trash': [] }, {where: {id: req.params.id}, returning: true})
    .then(([_, updated]) => res.status(201).json(updated[0]))
    .catch(next)
})

// PUT - Edit single post

// edit single post

// router.put('/:id/posts/:postId', (req, res, next) => {
//   return User.update(req.body, { where: {id: req.params.id}, returning: true})
//   .then(([_, updated]) => res.status(201).json(updated[0]))
//   .catch(next)
// })
