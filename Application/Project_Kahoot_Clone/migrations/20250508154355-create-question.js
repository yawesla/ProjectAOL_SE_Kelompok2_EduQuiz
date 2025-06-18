'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quizId: {
        type: Sequelize.INTEGER
      },
      questionText: {
        type: Sequelize.STRING
      },
      option_A: {
        type: Sequelize.STRING
      },
      option_B: {
        type: Sequelize.STRING
      },
      option_C: {
        type: Sequelize.STRING
      },
      option_D: {
        type: Sequelize.STRING
      },
      correctOption: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Questions');
  }
};