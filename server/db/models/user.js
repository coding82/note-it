const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('password')
    }
  },
  sugar: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('sugar')
    }
  },
  posts : {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: []
  }
})

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.sugar()) === this.password()
}

/**
 * classMethods
 */
User.generatesugar = function() {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function(plainText, sugar) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(sugar)
    .digest('hex')
}

/**
 * hooks
 */
const setsugarAndPassword = user => {
  if (user.changed('password')) {
    user.sugar = User.generatesugar()
    user.password = User.encryptPassword(user.password(), user.sugar())
  }
}

User.beforeCreate(setsugarAndPassword)
User.beforeUpdate(setsugarAndPassword)
