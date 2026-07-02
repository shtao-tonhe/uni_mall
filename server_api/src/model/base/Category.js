const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const snowflake = require('../../utils/snowflake')

const Category = sequelize.define('category', {
  id:     { type: DataTypes.STRING(64), primaryKey: true },
  name:   { type: DataTypes.STRING(64), allowNull: false, defaultValue: '' },
  pid:    { type: DataTypes.STRING(64), allowNull: false, defaultValue: '' },
  level:  { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1 },
  sort:   { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  status: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1 },
}, {
  indexes: [
    { fields: ['pid'] },
    { fields: ['sort'] },
  ],
})

Category.beforeCreate((c) => { if (!c.id) c.id = snowflake.nextId() })

module.exports = Category
