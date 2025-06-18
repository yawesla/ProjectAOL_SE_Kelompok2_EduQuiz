'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Quiz, { foreignKey: 'quizId' });
      this.hasMany(models.Answer, { foreignKey: 'questionId' });
    }
  }
  Question.init({
    quizId: DataTypes.INTEGER,
    questionText: DataTypes.STRING,
    option_A: DataTypes.STRING,
    option_B: DataTypes.STRING,
    option_C: DataTypes.STRING,
    option_D: DataTypes.STRING,
    correctOption: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};