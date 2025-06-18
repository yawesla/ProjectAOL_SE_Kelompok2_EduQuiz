'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'ownerId' });
      this.hasMany(models.Question, { foreignKey: 'quizId' });
      this.hasMany(models.Participant, { foreignKey: 'quizId' });
    }
  }
  Quiz.init({
    title: DataTypes.STRING,
    code: DataTypes.STRING,
    ownerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Quiz',
  });
  return Quiz;
};