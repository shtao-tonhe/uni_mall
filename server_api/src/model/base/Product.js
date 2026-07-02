const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const snowflake = require('../../utils/snowflake')

const Product = sequelize.define('product', {
  id:           { type: DataTypes.STRING(64), primaryKey: true },
  name:         { type: DataTypes.STRING(256), allowNull: false, defaultValue: '' },
  image:        { type: DataTypes.STRING(512), allowNull: false, defaultValue: '' },
  images:       { type: DataTypes.TEXT },
  video:        { type: DataTypes.STRING(512), allowNull: false, defaultValue: '' },
  desc:         { type: DataTypes.TEXT },
  categoryId:   { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'category_id' },
  price:        { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
  marketPrice:  { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00, field: 'market_price' },
  stock:        { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  sales:        { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  params:       { type: DataTypes.TEXT },
  specType:     { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0, field: 'spec_type' },
  specData:     { type: DataTypes.TEXT, field: 'spec_data' },
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

Product.beforeCreate((p) => { if (!p.id) p.id = snowflake.nextId() })

module.exports = Product
