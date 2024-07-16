'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  class mst_users_model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.mst_roles_model, {
        as: 'mst_roles',
        foreignKey: 'role_id',
      });
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
  mst_users_model.init(
    {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.UUID },
      fullname: DataTypes.STRING,
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      is_active: DataTypes.INTEGER,
      role_id: DataTypes.UUID,
      token: DataTypes.STRING,
      dokter_id: DataTypes.UUID,
      pasien_id: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'mst_users_model',
      tableName: 'mst_users',
    },
  );


  mst_users_model.beforeCreate(async (model, options) => {
    model.id = uuidv4()
  });

  return mst_users_model;
};
