const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const ShopConfig = sequelize.define('shop_config', {
  id:          { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name:        { type: DataTypes.STRING(128), allowNull: false, defaultValue: '' },
  logo:        { type: DataTypes.STRING(512), allowNull: false, defaultValue: '' },
  phone:       { type: DataTypes.STRING(20), allowNull: false, defaultValue: '' },
  province:    { type: DataTypes.STRING(32), allowNull: false, defaultValue: '' },
  city:        { type: DataTypes.STRING(32), allowNull: false, defaultValue: '' },
  district:    { type: DataTypes.STRING(32), allowNull: false, defaultValue: '' },
  address:     { type: DataTypes.STRING(256), allowNull: false, defaultValue: '' },
  freight:     { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
  freeFreight: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00, field: 'free_freight' },
})

module.exports = ShopConfig
