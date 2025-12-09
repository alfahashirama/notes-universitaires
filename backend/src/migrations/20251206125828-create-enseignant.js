'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('enseignants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      matricule: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      nom: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      prenom: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      telephone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      specialite: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      departementId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'departements',
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

    await queryInterface.addIndex('enseignants', ['matricule']);
    await queryInterface.addIndex('enseignants', ['email']);
    await queryInterface.addIndex('enseignants', ['departementId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('enseignants');
  }
};