export default function createVoteModel (sequelize, DataTypes) {
  const vote = sequelize.define('vote', {
    voterIp: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false,
    classMethods: {
      associate (models) {
        vote.belongsTo(models.pollOption)
      }
    }
  })

  return vote
}
