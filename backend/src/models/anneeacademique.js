'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AnneeAcademique extends Model {
    static associate(models) {
      // Une année académique a plusieurs semestres
      AnneeAcademique.hasMany(models.Semestre, {
        foreignKey: 'anneeAcademiqueId',
        as: 'semestres'
      });
    }
  }

  AnneeAcademique.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    libelle: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        msg: 'Cette année académique existe déjà'
      },
      validate: {
        notEmpty: {
          msg: 'Le libellé ne peut pas être vide'
        },
        is: {
          args: /^\d{4}-\d{4}$/,
          msg: 'Le format doit être YYYY-YYYY (ex: 2023-2024)'
        }
      }
    },
    dateDebut: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'La date de début doit être une date valide'
        }
      }
    },
    dateFin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'La date de fin doit être une date valide'
        },
        isAfterDateDebut(value) {
          if (this.dateDebut && value <= this.dateDebut) {
            throw new Error('La date de fin doit être après la date de début');
          }
        }
      }
    },
    estActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'AnneeAcademique',
    tableName: 'annees_academiques',
    timestamps: true,
    hooks: {
      beforeCreate: async (anneeAcademique) => {
        // Si cette année est active, désactiver toutes les autres
        if (anneeAcademique.estActive) {
          await AnneeAcademique.update(
            { estActive: false },
            { where: { estActive: true } }
          );
        }
      },
      beforeUpdate: async (anneeAcademique) => {
        if (anneeAcademique.changed('estActive') && anneeAcademique.estActive) {
          await AnneeAcademique.update(
            { estActive: false },
            { where: { estActive: true, id: { [sequelize.Sequelize.Op.ne]: anneeAcademique.id } } }
          );
        }
      }
    }
  });

  return AnneeAcademique;
};