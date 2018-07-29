const router = require('express').Router()
const {User} = require('../db/models')
const Sequelize = require('sequelize')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'posts']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

// new user

router.post('/', (req, res, next) => {
  return User.create(req.body)
    .then( user => res.status(201).json(user) )
    .catch(next)
})

// new post

router.put('/:id', (req, res, next) => {
  return User.update({'posts': Sequelize.fn('array_append', Sequelize.col('posts'), req.body.content)}, { where: {id: req.params.id}, returning: true})
    .then(([_, updated]) => res.status(201).json(updated[0]))
    .catch(next)
})

// get all posts for a signin user

router.get('/:id',(req, res, next) => {
  return User.findById(req.params.id)
    .then( user => res.json(user))
    .catch(next)
})

// delete all post

router.get('/:id/nopost', (req, res, next) => {
  return User.update({'posts': [] }, {where: {id: req.params.id}, returning: true})
    .then(([_, updated]) => res.status(201).json(updated[0]))
    .catch(next)
})

// delete single post

// router.delete('/:id/post/:postId', (req, res, next) => {

// })


// edit single post

// router.put('/:id/posts/:postId', (req, res, next) => {
//   return User.update(req.body, { where: {id: req.params.id}, returning: true})
//   .then(([_, updated]) => res.status(201).json(updated[0]))
//   .catch(next)
// })
