const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Address = sequelize.define('address', {
  id:        { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  userId:    { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'user_id' },
  consignee: { type: DataTypes.STRING(64), allowNull: false, defaultValue: '' },
  phone:     { type: DataTypes.STRING(20), allowNull: false, defaultValue: '' },
  province:  { type: DataTypes.STRING(32), allowNull: false, defaultValue: '' },
  city:      { type: DataTypes.STRING(32), allowNull: false, defaultValue: '' },
  district:  { type: DataTypes.STRING(32), allowNull: false, defaultValue: '' },
  detail:    { type: DataTypes.STRING(256), allowNull: false, defaultValue: '' },
  isDefault: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0, field: 'is_default' },
}, {
  indexes: [
    { fields: ['user_id'] },
  ],
})

module.exports = Address
