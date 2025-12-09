'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Departement extends Model {
    static associate(models) {
      // Un département a plusieurs étudiants
      Departement.hasMany(models.Etudiant, {
        foreignKey: 'departementId',
        as: 'etudiants'
      });

      // Un département a plusieurs enseignants
      Departement.hasMany(models.Enseignant, {
        foreignKey: 'departementId',
        as: 'enseignants'
      });
    }
  }

  Departement.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le nom du département ne peut pas être vide'
        },
        len: {
          args: [2, 100],
          msg: 'Le nom doit contenir entre 2 et 100 caractères'
        }
      }
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: {
        msg: 'Ce code de département existe déjà'
      },
      validate: {
        notEmpty: {
          msg: 'Le code ne peut pas être vide'
        },
        isUppercase: {
          msg: 'Le code doit être en majuscules'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Departement',
    tableName: 'departements',
    timestamps: true,
    hooks: {
      beforeValidate: (departement) => {
        if (departement.code) {
          departement.code = departement.code.toUpperCase();
        }
      }
    }
  });

  return Departement;
};