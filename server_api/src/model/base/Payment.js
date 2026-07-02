const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const snowflake = require('../../utils/snowflake')

const Payment = sequelize.define('payment', {
  id:            { type: DataTypes.STRING(64), primaryKey: true },
  orderId:       { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'order_id' },
  orderNo:       { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'order_no' },
  userId:        { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'user_id' },
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

Payment.beforeCreate((p) => { if (!p.id) p.id = snowflake.nextId() })

module.exports = Payment
