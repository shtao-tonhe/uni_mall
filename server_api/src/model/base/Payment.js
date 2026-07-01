const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Payment = sequelize.define('payment', {
  id:            { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  orderId:       { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'order_id' },
  orderNo:       { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'order_no' },
  userId:        { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'user_id' },
  amount:        { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
  payType:       { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1, field: 'pay_type' },
  transactionId: { type: DataTypes.STRING(128), allowNull: false, defaultValue: '', field: 'transaction_id' },
  status:        { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0 },
  payTime:       { type: DataTypes.DATE, field: 'pay_time' },
}, {
  indexes: [
    { fields: ['order_id'] },
    { fields: ['user_id'] },
    { fields: ['transaction_id'] },
  ],
})

module.exports = Payment
