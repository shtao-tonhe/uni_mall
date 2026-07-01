const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Banner = sequelize.define('banner', {
  id:         { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  title:      { type: DataTypes.STRING(128), allowNull: false, defaultValue: '' },
  image:      { type: DataTypes.STRING(512), allowNull: false, defaultValue: '' },
  jumpType:   { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1, field: 'jump_type' },
  jumpTarget: { type: DataTypes.STRING(1024), allowNull: false, defaultValue: '', field: 'jump_target' },
  startTime:  { type: DataTypes.DATE, field: 'start_time' },
  endTime:    { type: DataTypes.DATE, field: 'end_time' },
  status:     { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1 },
  sort:       { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
}, {
  indexes: [
    { fields: ['status'] },
    { fields: ['sort'] },
    { fields: ['start_time', 'end_time'] },
  ],
})

module.exports = Banner
