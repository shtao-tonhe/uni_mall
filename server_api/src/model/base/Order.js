const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const snowflake = require('../../utils/snowflake')

const Order = sequelize.define('order', {
  id:             { type: DataTypes.STRING(64), primaryKey: true },
  orderNo:        { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'order_no' },
  userId:         { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'user_id' },
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
  deliveryCompany:{ type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'delivery_company' },
  deliveryNo:     { type: DataTypes.STRING(128), allowNull: false, defaultValue: '', field: 'delivery_no' },
}, {
  indexes: [
    { unique: true, fields: ['order_no'] },
    { fields: ['user_id'] },
    { fields: ['status'] },
  ],
})

Order.beforeCreate((o) => { if (!o.id) o.id = snowflake.nextId() })

Order.associate = function (models) {
  Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' })
  Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
}

module.exports = Order
