'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  class trx_jadwal_periksa_model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.mst_dokter_model, {
            as: 'mst_dokter',
            foreignKey: 'dokter_id',
          });
        this.belongsTo(models.mst_pasien_model, {
            as: 'mst_pasien',
            foreignKey: 'pasien_id',
          }); 
    }
  }
  trx_jadwal_periksa_model.init(
    {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.UUID },
      pasien_id : DataTypes.UUID,
      dokter_id : DataTypes.UUID,
      jadwal_periksa : DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'trx_jadwal_periksa_model',
      tableName: 'trx_jadwal_periksa',
    },
  );

  trx_jadwal_periksa_model.beforeCreate(async (model, options) => {
    model.id = uuidv4()
  });

  return trx_jadwal_periksa_model;
};
