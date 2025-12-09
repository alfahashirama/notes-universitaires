'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('matieres', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      nom: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      coefficient: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1
        }
      },
      creditECTS: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3,
        comment: 'Crédits ECTS',
        validate: {
          min: 1
        }
      },
      semestreId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'semestres',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      enseignantId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'enseignants',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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

    await queryInterface.addIndex('matieres', ['code']);
    await queryInterface.addIndex('matieres', ['semestreId']);
    await queryInterface.addIndex('matieres', ['enseignantId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('matieres');
  }
};