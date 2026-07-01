const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Category = sequelize.define('category', {
  id:     { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name:   { type: DataTypes.STRING(64), allowNull: false, defaultValue: '' },
  pid:    { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  level:  { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1 },
  sort:   { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  status: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1 },
}, {
  indexes: [
    { fields: ['pid'] },
    { fields: ['sort'] },
  ],
})

module.exports = Category
