'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mst_dokter', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      code: {type: Sequelize.STRING},
      nama: {type: Sequelize.STRING},
      jadwal_kerja: {type: Sequelize.DATE},
      spesialis_id: {type: Sequelize.UUID,
        allowNull: false,
      references: {
        model: {
          tableName: 'mst_spesialis',
        },
        key: "id",
      }}
      ,
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
    await queryInterface.dropTable('mst_dokter');
  }
};