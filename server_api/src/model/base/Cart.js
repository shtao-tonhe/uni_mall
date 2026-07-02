const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const snowflake = require('../../utils/snowflake')

const Cart = sequelize.define('cart', {
  id:        { type: DataTypes.STRING(64), primaryKey: true },
  userId:    { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'user_id' },
  productId: { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'product_id' },
  specId:    { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'spec_id' },
  num:       { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
  selected:  { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1 },
}, {
  indexes: [
    { fields: ['user_id'] },
    { fields: ['product_id'] },
  ],
})

Cart.beforeCreate((c) => { if (!c.id) c.id = snowflake.nextId() })

module.exports = Cart
