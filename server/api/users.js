const router = require('express').Router()
const {User} = require('../db/models')
const Sequelize = require('sequelize')
module.exports = router
const { isLoggedIn, isAdmin } = require('./utility')

// GET - all users

router.get('/', (req, res, next) => {
  return User.findAll()
    .then( users => res.json(users).status(200))
    .catch(next)
})

// GET - single user

router.get('/:id', (req, res, next) => {
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

router.put('/:id/newpost', (req, res, next) => {
  // req.body.content
  console.log(req.body)
  return User.update({'posts': Sequelize.fn('array_append', Sequelize.col('posts'), req.body.content)}, { where: {id: req.params.id}, returning: true})
    .then(([_, updated]) => res.status(201).json(updated[0]))
    .catch(next)
})

////// MOVE ONE TO TRASH //////
//PUT - delete single post

router.put('/:id/onetotrash', (req, res, next) => {
  // put input - req.body.id
  const id = +Object.keys(req.body)

  return User.findById(req.params.id)
    .then( user => {
      let outItem = user.posts.splice( +id, 1)
              User.update(
                {'trash': Sequelize.fn('array_append', Sequelize.col('trash'), outItem[0])},
                {where: {id: req.params.id},
                returning: true})
       return User.update(
                {'posts': user.posts},
                {where: {id: req.params.id},
                returning: true})
        .then(([_, updated]) => res.status(201).json(updated[0]))
    })
    .catch(next)
})



router.put('/:id/deleteoneforever', (req, res, next) => {
  // put input - req.body.id
  const id = +Object.keys(req.body)
  console.log(req.body)
  return User.findById(req.params.id)
    .then( user => {
      user.trash.splice( +id, 1)
       return User.update(
                {'trash': user.trash},
                {where: {id: req.params.id},
                returning: true})
        .then(([_, updated]) => res.status(201).json(updated[0]))
    })
    .catch(next)
})

/////// RESTORE ONE ///////

router.put('/:id/restoreone', (req, res, next) => {
  const id = +Object.keys(req.body)

  return User.findById(req.params.id)
    .then( user => {
      let outItem = user.trash.splice(id, 1)
              User.update(
                {'posts': Sequelize.fn('array_append', Sequelize.col('posts'), outItem[0])},
                {where: {id: req.params.id},
                returning: true})
       return User.update(
                {'trash': user.trash},
                {where: {id: req.params.id},
                returning: true})
        .then(([_, updated]) => res.status(201).json(updated[0]))
    })
    .catch(next)
})

/////// RESTORE ALL ///////

router.put('/:id/restoreall', (req, res, next) => {
  return User.findById(req.params.id)
    .then( user => {
      const newposts = user.posts.concat(user.trash);
              User.update({'posts': newposts}, {where: {id: req.params.id}, returning: true})
      return User.update({'trash': []}, {where: {id: req.params.id}, returning: true})
    })
    .then(([_, updated]) => res.status(201).json(updated[0]))
})

/////// MOVE ALL TO TRASH //////

router.put('/:id/movealltotrash', (req, res, next) => {
  return User.findById(req.params.id)
    .then( user => {
      const newtrash = user.trash.concat(user.posts);
              User.update({'trash': newtrash}, {where: {id: req.params.id}, returning: true})
      return User.update({'posts': []}, {where: {id: req.params.id}, returning: true})
    })
    .then(([_, updated]) => res.status(201).json(updated[0]))
})



////// DELETE ALL THE POSTS FROM THE POST BIN //////
// PUT - Empty the posts array

// router.put('/:id/emptyposts', (req, res, next) => {
//   return User.update({'posts': [] }, {where: {id: req.params.id}, returning: true})
//     .then(([_, updated]) => res.status(201).json(updated[0]))
//     .catch(next)
// })

////// DELETE ALL //////
// PUT - Empty the trash array

router.put('/:id/emptytrash', (req, res, next) => {
  return User.update({'trash': [] }, {where: {id: req.params.id}, returning: true})
    .then(([_, updated]) => res.status(201).json(updated[0]))
    .catch(next)
})

router.put('/:id/editone', (req, res, next) => {
  let {id, content} = req.body
  return User.findById(req.params.id)
    .then( user => {
      user.posts.splice(id, 1, content);
      return User.update({'posts': user.posts}, {where: {id: req.params.id}, returning: true })
    })
    .then(([_, updated]) => res.status(201).json(updated[0]))
    .catch(next)
})
