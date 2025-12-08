'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    static associate(models) {
      // Une note appartient à un étudiant
      Note.belongsTo(models.Etudiant, {
        foreignKey: 'etudiantId',
        as: 'etudiant'
      });

      // Une note appartient à une matière
      Note.belongsTo(models.Matiere, {
        foreignKey: 'matiereId',
        as: 'matiere'
      });
    }

    // Méthode pour vérifier si l'étudiant a validé
    get estValide() {
      return this.valeur >= 10;
    }

    // Méthode pour obtenir la mention
    get mention() {
      if (this.valeur < 10) return 'Ajourné';
      if (this.valeur < 12) return 'Passable';
      if (this.valeur < 14) return 'Assez Bien';
      if (this.valeur < 16) return 'Bien';
      if (this.valeur < 18) return 'Très Bien';
      return 'Excellent';
    }
  }

  Note.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    valeur: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'La note ne peut pas être négative'
        },
        max: {
          args: [20],
          msg: 'La note ne peut pas dépasser 20'
        },
        isDecimal: {
          msg: 'La note doit être un nombre décimal valide'
        }
      }
    },
    session: {
      type: DataTypes.ENUM('normale', 'rattrapage'),
      allowNull: false,
      defaultValue: 'normale',
      validate: {
        isIn: {
          args: [['normale', 'rattrapage']],
          msg: 'La session doit être "normale" ou "rattrapage"'
        }
      }
    },
    typeEvaluation: {
      type: DataTypes.ENUM('CC', 'TP', 'Examen', 'Projet'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['CC', 'TP', 'Examen', 'Projet']],
          msg: 'Le type d\'évaluation doit être: CC, TP, Examen ou Projet'
        }
      }
    },
    etudiantId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'L\'étudiant est requis'
        }
      }
    },
    matiereId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La matière est requise'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Note',
    tableName: 'notes',
    timestamps: true
  });

  return Note;
};