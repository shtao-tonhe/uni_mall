const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Cart = sequelize.define('cart', {
  id:        { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  userId:    { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'user_id' },
  productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'product_id' },
  specId:    { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'spec_id' },
  num:       { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
  selected:  { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1 },
}, {
  indexes: [
    { fields: ['user_id'] },
    { fields: ['product_id'] },
  ],
})

module.exports = Cart
