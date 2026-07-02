const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const snowflake = require('../../utils/snowflake')

const Admin = sequelize.define('admin', {
  id:       { type: DataTypes.STRING(64), primaryKey: true },
  username: { type: DataTypes.STRING(64), allowNull: false },
  password: { type: DataTypes.STRING(128), allowNull: false },
  nickname: { type: DataTypes.STRING(64), allowNull: false, defaultValue: '' },
  avatar:   { type: DataTypes.STRING(512), allowNull: false, defaultValue: '' },
  status:   { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1 },
  role:     { type: DataTypes.STRING(32), allowNull: false, defaultValue: 'admin' },
}, {
  indexes: [
    { unique: true, fields: ['username'] },
  ],
})

Admin.beforeCreate((instance) => {
  if (!instance.id) instance.id = snowflake.nextId()
})

module.exports = Admin
