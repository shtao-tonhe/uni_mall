const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Product = sequelize.define('product', {
  id:           { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name:         { type: DataTypes.STRING(256), allowNull: false, defaultValue: '' },
  image:        { type: DataTypes.STRING(512), allowNull: false, defaultValue: '' },
  images:       { type: DataTypes.TEXT },
  desc:         { type: DataTypes.TEXT },
  categoryId:   { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'category_id' },
  price:        { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
  marketPrice:  { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00, field: 'market_price' },
  stock:        { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  sales:        { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  status:       { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1 },
  isHot:        { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0, field: 'is_hot' },
  isNew:        { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0, field: 'is_new' },
  isRecommend:  { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0, field: 'is_recommend' },
  sort:         { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
}, {
  indexes: [
    { fields: ['category_id'] },
    { fields: ['status'] },
    { fields: ['sort'] },
  ],
})

module.exports = Product
