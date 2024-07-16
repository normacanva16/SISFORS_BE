'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  class mst_spesialis_model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.mst_dokter_model, {
        as: 'mst_dokter',
        foreignKey: 'spesialis_id',
      });
    }
  }
  mst_spesialis_model.init(
    {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.UUID },
      name: DataTypes.STRING,
      code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'mst_spesialis_model',
      tableName: 'mst_spesialis',
    },
  );

  mst_spesialis_model.beforeCreate(async (model, options) => {
    model.id = uuidv4()
  });

  return mst_spesialis_model;
};
