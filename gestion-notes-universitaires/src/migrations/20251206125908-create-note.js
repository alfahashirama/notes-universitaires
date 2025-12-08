'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      valeur: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          min: 0,
          max: 20
        }
      },
      session: {
        type: Sequelize.ENUM('normale', 'rattrapage'),
        allowNull: false,
        defaultValue: 'normale'
      },
      typeEvaluation: {
        type: Sequelize.ENUM('CC', 'TP', 'Examen', 'Projet'),
        allowNull: false,
        comment: 'CC=Contrôle Continu, TP=Travaux Pratiques'
      },
      etudiantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'etudiants',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      matiereId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'matieres',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    await queryInterface.addIndex('notes', ['etudiantId']);
    await queryInterface.addIndex('notes', ['matiereId']);
    await queryInterface.addIndex('notes', ['session']);
    
    // Contrainte unique pour éviter les doublons
    await queryInterface.addConstraint('notes', {
      fields: ['etudiantId', 'matiereId', 'typeEvaluation', 'session'],
      type: 'unique',
      name: 'unique_note_etudiant_matiere_type_session'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notes');
  }
};