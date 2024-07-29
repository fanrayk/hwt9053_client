'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hwt9053 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  hwt9053.init({
    x_acc: DataTypes.FLOAT,
    y_acc: DataTypes.FLOAT,
    z_acc: DataTypes.FLOAT,
    x_ang: DataTypes.FLOAT,
    y_ang: DataTypes.FLOAT,
    z_ang: DataTypes.FLOAT,
    x_acc_filtered: DataTypes.FLOAT,
    y_acc_filtered: DataTypes.FLOAT,
    z_acc_filtered: DataTypes.FLOAT,
    x_ang_filtered: DataTypes.FLOAT,
    y_ang_filtered: DataTypes.FLOAT,
    z_ang_filtered: DataTypes.FLOAT,
    rssi: DataTypes.INTEGER,
    snr: DataTypes.INTEGER,
    time: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'hwt9053',
  });
  return hwt9053;
};