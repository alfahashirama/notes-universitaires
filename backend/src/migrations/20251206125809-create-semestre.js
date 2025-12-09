'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('semestres', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      nom: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'Ex: Semestre 1, Semestre 2'
      },
      numero: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 10
        }
      },
      anneeAcademiqueId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'annees_academiques',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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

    await queryInterface.addIndex('semestres', ['anneeAcademiqueId']);
    await queryInterface.addIndex('semestres', ['numero']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('semestres');
  }
};