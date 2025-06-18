'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.belongsTo(models.Quiz, { foreignKey: 'quizId' });
      this.hasMany(models.Answer, { foreignKey: 'participantId' });
    }
  }
  Participant.init({
    userId: DataTypes.INTEGER,
    quizId: DataTypes.INTEGER,
    username: DataTypes.STRING,
    score: DataTypes.INTEGER,
    joinTime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Participant',
  });
  return Participant;
};