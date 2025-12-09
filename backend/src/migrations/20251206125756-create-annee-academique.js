'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('annees_academiques', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      libelle: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
        comment: 'Ex: 2023-2024'
      },
      dateDebut: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      dateFin: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      estActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('annees_academiques', ['estActive']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('annees_academiques');
  }
};