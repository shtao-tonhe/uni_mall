const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Refund = sequelize.define('refund', {
  id:           { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  refundNo:     { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'refund_no' },
  orderId:      { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'order_id' },
  orderItemId:  { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'order_item_id' },
  userId:       { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'user_id' },
  reason:       { type: DataTypes.STRING(512), allowNull: false, defaultValue: '' },
  amount:       { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
  status:       { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0 },
  refuseReason: { type: DataTypes.STRING(512), allowNull: false, defaultValue: '', field: 'refuse_reason' },
  auditTime:    { type: DataTypes.DATE, field: 'audit_time' },
  completedTime:{ type: DataTypes.DATE, field: 'completed_time' },
}, {
  indexes: [
    { unique: true, fields: ['refund_no'] },
    { fields: ['order_id'] },
    { fields: ['user_id'] },
  ],
})

module.exports = Refund
