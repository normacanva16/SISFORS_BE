'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trx_jadwal_periksa', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      pasien_id: {type: Sequelize.UUID,
        allowNull: true,
      references: {
        model: {
          tableName: 'mst_pasien',
        },
        key: "id",
      }},
      dokter_id: {type: Sequelize.UUID,
        allowNull: true,
      references: {
        model: {
          tableName: 'mst_dokter',
        },
        key: "id",
      }},
      jadwal_periksa: {type: Sequelize.DATE},
      created_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      created_by:{
        type: Sequelize.UUID
      },
      updated_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_by: {
        type: Sequelize.UUID
      },
      deleted_date:{
        type: Sequelize.DATE
      },
      deleted_by:{
        type: Sequelize.UUID
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('trx_jadwal_periksa');
  }
};