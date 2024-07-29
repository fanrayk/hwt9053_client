'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hwt9053s', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      x_acc: {
        type: Sequelize.FLOAT
      },
      y_acc: {
        type: Sequelize.FLOAT
      },
      z_acc: {
        type: Sequelize.FLOAT
      },
      x_ang: {
        type: Sequelize.FLOAT
      },
      y_ang: {
        type: Sequelize.FLOAT
      },
      z_ang: {
        type: Sequelize.FLOAT
      },
      x_acc_filtered: {
        type: Sequelize.FLOAT
      },
      y_acc_filtered: {
        type: Sequelize.FLOAT
      },
      z_acc_filtered: {
        type: Sequelize.FLOAT
      },
      x_ang_filtered: {
        type: Sequelize.FLOAT
      },
      y_ang_filtered: {
        type: Sequelize.FLOAT
      },
      z_ang_filtered: {
        type: Sequelize.FLOAT
      },
      time: {
        type: Sequelize.DATE
      },
      rssi: {
        type: Sequelize.INTEGER
      },
      snr: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('hwt9053s');
  }
};