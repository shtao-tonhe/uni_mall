const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const snowflake = require('../../utils/snowflake')

const OrderItem = sequelize.define('order_item', {
  id:           { type: DataTypes.STRING(64), primaryKey: true },
  orderId:      { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'order_id' },
  productId:    { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'product_id' },
  productName:  { type: DataTypes.STRING(256), allowNull: false, defaultValue: '', field: 'product_name' },
  productImage: { type: DataTypes.STRING(512), allowNull: false, defaultValue: '', field: 'product_image' },
  specId:       { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'spec_id' },
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

OrderItem.beforeCreate((oi) => { if (!oi.id) oi.id = snowflake.nextId() })

OrderItem.associate = function (models) {
  OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' })
}

module.exports = OrderItem
