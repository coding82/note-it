'use strict'

const db = require('./db')
const {User} = require('./db/models')
const namor = require('namor')

const data = () => {
  const arr = [];
  for(let i=0; i<5; i++){
    arr.push(namor.generate({words:4, numbers:0}).split('-').join(' '))
  } return arr;
}

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')


  const users = await Promise.all([
    User.create({email: 'eunji@email.com', password: '123', posts: data()}),
    User.create({email: 'cheng@email.com', password: '123', posts: data()}),
    User.create({email: 'song@email.com', password: '123', posts: data()}),
    User.create({email: 'lin@email.com', password: '123', posts: data()}),
    User.create({email: 'kim@email.com', password: '123', posts: data()})
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}

async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')

    await db.close()
    console.log('db connection closed')
  }
}

if (module === require.main) {
  runSeed()
}

module.exports = seed
