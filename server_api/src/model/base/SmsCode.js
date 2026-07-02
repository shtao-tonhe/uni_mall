const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const snowflake = require('../../utils/snowflake')

const SmsCode = sequelize.define('sms_code', {
  id:        { type: DataTypes.STRING(64), primaryKey: true },
  phone:     { type: DataTypes.STRING(20), allowNull: false, defaultValue: '' },
  code:      { type: DataTypes.STRING(6), allowNull: false, defaultValue: '' },
  type:      { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1 },
  expiredAt: { type: DataTypes.DATE, allowNull: false, field: 'expired_at' },
  used:      { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0 },
  usedAt:    { type: DataTypes.DATE, field: 'used_at' },
}, {
  indexes: [
    { fields: ['phone'] },
    { fields: ['phone', 'code'] },
  ],
})

SmsCode.beforeCreate((s) => { if (!s.id) s.id = snowflake.nextId() })

module.exports = SmsCode
