const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const snowflake = require('../../utils/snowflake')

const ProductSpec = sequelize.define('product_spec', {
  id:        { type: DataTypes.STRING(64), primaryKey: true },
  productId: { type: DataTypes.STRING(64), allowNull: false, defaultValue: '', field: 'product_id' },
  specKey:   { type: DataTypes.STRING(128), allowNull: false, defaultValue: '', field: 'spec_key' },
  specName:  { type: DataTypes.STRING(128), allowNull: false, defaultValue: '', field: 'spec_name' },
  specs:     { type: DataTypes.TEXT },
  price:     { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
  stock:     { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  image:     { type: DataTypes.STRING(512), allowNull: false, defaultValue: '' },
}, {
  indexes: [
    { fields: ['product_id'] },
  ],
})

ProductSpec.beforeCreate((ps) => { if (!ps.id) ps.id = snowflake.nextId() })

module.exports = ProductSpec
