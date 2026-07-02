const { SnowflakeId } = require('@akashrajpurohit/snowflake-id')

const snowflake = SnowflakeId({
  workerId: 1,
  epoch: 1700000000000,
})

module.exports = {
  nextId: () => snowflake.generate(),
}
