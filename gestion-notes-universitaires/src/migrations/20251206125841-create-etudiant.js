'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('etudiants', {
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
      dateNaissance: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      lieuNaissance: {
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
      adresse: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      niveau: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: 'Ex: L1, L2, L3, M1, M2'
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

    await queryInterface.addIndex('etudiants', ['matricule']);
    await queryInterface.addIndex('etudiants', ['email']);
    await queryInterface.addIndex('etudiants', ['departementId']);
    await queryInterface.addIndex('etudiants', ['niveau']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('etudiants');
  }
};