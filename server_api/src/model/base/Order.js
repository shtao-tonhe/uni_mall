const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Order = sequelize.define('order', {
  id:             { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  orderNo:        { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'order_no' },
  userId:         { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'user_id' },
  totalAmount:    { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00, field: 'total_amount' },
  payAmount:      { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00, field: 'pay_amount' },
  freightAmount:  { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00, field: 'freight_amount' },
  discountAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00, field: 'discount_amount' },
  payType:        { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0, field: 'pay_type' },
  status:         { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0 },
  payTime:        { type: DataTypes.DATE, field: 'pay_time' },
  deliveryTime:   { type: DataTypes.DATE, field: 'delivery_time' },
  receiveTime:    { type: DataTypes.DATE, field: 'receive_time' },
  closeTime:      { type: DataTypes.DATE, field: 'close_time' },
  consignee:      { type: DataTypes.STRING(64), allowNull: false, defaultValue: '' },
  phone:          { type: DataTypes.STRING(20), allowNull: false, defaultValue: '' },
  address:        { type: DataTypes.STRING(256), allowNull: false, defaultValue: '' },
  remark:         { type: DataTypes.STRING(512), allowNull: false, defaultValue: '' },
}, {
  indexes: [
    { unique: true, fields: ['order_no'] },
    { fields: ['user_id'] },
    { fields: ['status'] },
  ],
})

module.exports = Order
