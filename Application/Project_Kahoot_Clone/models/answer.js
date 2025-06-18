'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Participant, { foreignKey: 'participantId' });
      this.belongsTo(models.Question, { foreignKey: 'questionId' });
    }
  }
  Answer.init({
    participantId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    chosenOption: DataTypes.STRING,
    isCorrect: DataTypes.BOOLEAN,
    timeTaken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Answer',
  });
  return Answer;
};