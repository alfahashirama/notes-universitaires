'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Enseignant extends Model {
    static associate(models) {
      // Un enseignant appartient à un département
      Enseignant.belongsTo(models.Departement, {
        foreignKey: 'departementId',
        as: 'departement'
      });

      // Un enseignant peut enseigner plusieurs matières
      Enseignant.hasMany(models.Matiere, {
        foreignKey: 'enseignantId',
        as: 'matieres'
      });
    }

    // Méthode instance pour obtenir le nom complet
    get nomComplet() {
      return `${this.prenom} ${this.nom}`;
    }
  }

  Enseignant.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    matricule: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        msg: 'Ce matricule existe déjà'
      },
      validate: {
        notEmpty: {
          msg: 'Le matricule ne peut pas être vide'
        }
      }
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le nom ne peut pas être vide'
        },
        len: {
          args: [2, 100],
          msg: 'Le nom doit contenir entre 2 et 100 caractères'
        }
      }
    },
    prenom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le prénom ne peut pas être vide'
        },
        len: {
          args: [2, 100],
          msg: 'Le prénom doit contenir entre 2 et 100 caractères'
        }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'Cet email est déjà utilisé'
      },
      validate: {
        isEmail: {
          msg: 'L\'email doit être valide'
        },
        notEmpty: {
          msg: 'L\'email ne peut pas être vide'
        }
      }
    },
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
          args: /^[\d\s\+\-\(\)]+$/,
          msg: 'Le numéro de téléphone n\'est pas valide'
        }
      }
    },
    specialite: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    departementId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le département est requis'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Enseignant',
    tableName: 'enseignants',
    timestamps: true,
    hooks: {
      beforeValidate: (enseignant) => {
        if (enseignant.email) {
          enseignant.email = enseignant.email.toLowerCase();
        }
        if (enseignant.matricule) {
          enseignant.matricule = enseignant.matricule.toUpperCase();
        }
      }
    }
  });

  return Enseignant;
};