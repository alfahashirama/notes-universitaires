'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Matiere extends Model {
    static associate(models) {
      // Une matière appartient à un semestre
      Matiere.belongsTo(models.Semestre, {
        foreignKey: 'semestreId',
        as: 'semestre'
      });

      // Une matière est enseignée par un enseignant
      Matiere.belongsTo(models.Enseignant, {
        foreignKey: 'enseignantId',
        as: 'enseignant'
      });

      // Une matière a plusieurs notes
      Matiere.hasMany(models.Note, {
        foreignKey: 'matiereId',
        as: 'notes'
      });
    }
  }

  Matiere.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        msg: 'Ce code de matière existe déjà'
      },
      validate: {
        notEmpty: {
          msg: 'Le code ne peut pas être vide'
        }
      }
    },
    nom: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le nom de la matière ne peut pas être vide'
        },
        len: {
          args: [2, 150],
          msg: 'Le nom doit contenir entre 2 et 150 caractères'
        }
      }
    },
    coefficient: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: {
          args: [1],
          msg: 'Le coefficient doit être au moins 1'
        },
        max: {
          args: [10],
          msg: 'Le coefficient ne peut pas dépasser 10'
        }
      }
    },
    creditECTS: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      validate: {
        min: {
          args: [1],
          msg: 'Les crédits ECTS doivent être au moins 1'
        },
        max: {
          args: [30],
          msg: 'Les crédits ECTS ne peuvent pas dépasser 30'
        }
      }
    },
    semestreId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le semestre est requis'
        }
      }
    },
    enseignantId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Matiere',
    tableName: 'matieres',
    timestamps: true,
    hooks: {
      beforeValidate: (matiere) => {
        if (matiere.code) {
          matiere.code = matiere.code.toUpperCase();
        }
      }
    }
  });

  return Matiere;
};