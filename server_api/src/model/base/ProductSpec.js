const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const ProductSpec = sequelize.define('product_spec', {
  id:        { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'product_id' },
  specName:  { type: DataTypes.STRING(128), allowNull: false, defaultValue: '', field: 'spec_name' },
  price:     { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
  stock:     { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  image:     { type: DataTypes.STRING(512), allowNull: false, defaultValue: '' },
}, {
  indexes: [
    { fields: ['product_id'] },
  ],
})

module.exports = ProductSpec
