'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  class mst_dokter_model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.mst_spesialis_model, {
            as: 'mst_spesialis',
            foreignKey: 'spesialis_id',
          });
          this.hasMany(models.trx_jadwal_periksa_model, {
            as: 'trx_jadwal_periksa',
            foreignKey: 'dokter_id',
          });
          this.hasMany(models.mst_users_model, {
            as: 'mst_users',
            foreignKey: 'dokter_id',
          });
    }
  }
  mst_dokter_model.init(
    {
      id: { allowNull: true, primaryKey: true, type: DataTypes.UUID },
      code: DataTypes.INTEGER,
      nama: DataTypes.STRING,
      spesialis_id: DataTypes.UUID,
      jadwal_kerja: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'mst_dokter_model',
      tableName: 'mst_dokter',
    },
  );
  mst_dokter_model.beforeCreate(async (model, options) => {
    model.id = uuidv4()
  });
  
  return mst_dokter_model;
};
