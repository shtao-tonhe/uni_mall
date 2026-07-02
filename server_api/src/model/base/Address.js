const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const snowflake = require('../../utils/snowflake')

const Address = sequelize.define('address', {
  id:        { type: DataTypes.STRING(64), primaryKey: true },
  userId:    { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'user_id' },
  consignee: { type: DataTypes.STRING(64), allowNull: false, defaultValue: '' },
  phone:     { type: DataTypes.STRING(20), allowNull: false, defaultValue: '' },
  province:  { type: DataTypes.STRING(32), allowNull: false, defaultValue: '' },
  city:      { type: DataTypes.STRING(32), allowNull: false, defaultValue: '' },
  district:  { type: DataTypes.STRING(32), allowNull: false, defaultValue: '' },
  street:    { type: DataTypes.STRING(64), allowNull: false, defaultValue: '' },
  detail:    { type: DataTypes.STRING(256), allowNull: false, defaultValue: '' },
  isDefault: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0, field: 'is_default' },
}, {
  indexes: [
    { fields: ['user_id'] },
  ],
})

Address.beforeCreate((a) => { if (!a.id) a.id = snowflake.nextId() })

module.exports = Address
