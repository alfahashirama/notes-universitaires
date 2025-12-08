'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Semestre extends Model {
    static associate(models) {
      // Un semestre appartient à une année académique
      Semestre.belongsTo(models.AnneeAcademique, {
        foreignKey: 'anneeAcademiqueId',
        as: 'anneeAcademique'
      });

      // Un semestre a plusieurs matières
      Semestre.hasMany(models.Matiere, {
        foreignKey: 'semestreId',
        as: 'matieres'
      });
    }
  }

  Semestre.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    nom: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le nom du semestre ne peut pas être vide'
        }
      }
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'Le numéro du semestre doit être au moins 1'
        },
        max: {
          args: [10],
          msg: 'Le numéro du semestre ne peut pas dépasser 10'
        }
      }
    },
    anneeAcademiqueId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'L\'année académique est requise'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Semestre',
    tableName: 'semestres',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['numero', 'anneeAcademiqueId'],
        name: 'unique_semestre_annee'
      }
    ]
  });

  return Semestre;
};