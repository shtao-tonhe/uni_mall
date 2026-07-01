const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const User = sequelize.define('user', {
  id:       { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  openid:   { type: DataTypes.STRING(64),  allowNull: true },
  unionid:  { type: DataTypes.STRING(64),  allowNull: true },
  nickname: { type: DataTypes.STRING(64),  allowNull: false, defaultValue: '' },
  avatar:   { type: DataTypes.STRING(512), allowNull: false, defaultValue: '' },
  phone:    { type: DataTypes.STRING(20),  allowNull: true },
  gender:   { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0 },
  status:   { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1 },
}, {
  indexes: [
    { unique: true, fields: ['openid'] },
    { unique: true, fields: ['phone'] },
  ],
})

module.exports = User
