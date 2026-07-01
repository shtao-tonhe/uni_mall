const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const OrderItem = sequelize.define('order_item', {
  id:           { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  orderId:      { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'order_id' },
  productId:    { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'product_id' },
  productName:  { type: DataTypes.STRING(256), allowNull: false, defaultValue: '', field: 'product_name' },
  productImage: { type: DataTypes.STRING(512), allowNull: false, defaultValue: '', field: 'product_image' },
  specId:       { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'spec_id' },
  specName:     { type: DataTypes.STRING(128), allowNull: false, defaultValue: '', field: 'spec_name' },
  price:        { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
  num:          { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
  subtotal:     { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
}, {
  indexes: [
    { fields: ['order_id'] },
    { fields: ['product_id'] },
  ],
})

module.exports = OrderItem
