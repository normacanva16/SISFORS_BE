'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  class mst_pasien_model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.hasMany(models.trx_riwayat_pasien_model, {
            as: 'trx_riwayat_pasien',
            foreignKey: 'pasien_id',
          });   
          this.hasMany(models.trx_jadwal_periksa_model, {
            as: 'trx_jadwal_periksa',
            foreignKey: 'pasien_id',
          });
          this.hasMany(models.mst_users_model, {
            as: 'mst_users',
            foreignKey: 'pasien_id',
          });
    
    }
  }
  mst_pasien_model.init(
    {
      id: { allowNull: true, primaryKey: true, type: DataTypes.UUID },
      code: DataTypes.INTEGER,
      nama: DataTypes.STRING,
      usia: DataTypes.STRING,
      alamat: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'mst_pasien_model',
      tableName: 'mst_pasien',
    },
  );
  mst_pasien_model.beforeCreate(async (model, options) => {
    model.id = uuidv4()
  });
  
  return mst_pasien_model;
};
