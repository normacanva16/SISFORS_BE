'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  class trx_riwayat_pasien_model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.mst_pasien_model, {
        as: 'mst_pasien',
        foreignKey: 'pasien_id',
      });
    }
  }
  trx_riwayat_pasien_model.init(
    {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.UUID },
      pasien_id: DataTypes.UUID,
      riwayat: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'trx_riwayat_pasien_model',
      tableName: 'trx_riwayat_pasien',
    },
  );


  trx_riwayat_pasien_model.beforeCreate(async (model, options) => {
    model.id = uuidv4()
  });

  return trx_riwayat_pasien_model;
};
