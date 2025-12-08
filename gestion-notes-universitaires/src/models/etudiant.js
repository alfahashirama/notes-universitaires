'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Etudiant extends Model {
    static associate(models) {
      // Un étudiant appartient à un département
      Etudiant.belongsTo(models.Departement, {
        foreignKey: 'departementId',
        as: 'departement'
      });

      // Un étudiant a plusieurs notes
      Etudiant.hasMany(models.Note, {
        foreignKey: 'etudiantId',
        as: 'notes'
      });
    }

    // Méthode instance pour obtenir le nom complet
    get nomComplet() {
      return `${this.prenom} ${this.nom}`;
    }

    // Méthode pour calculer l'âge
    get age() {
      if (!this.dateNaissance) return null;
      const today = new Date();
      const birthDate = new Date(this.dateNaissance);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
  }

  Etudiant.init({
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
    dateNaissance: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'La date de naissance doit être une date valide'
        },
        isBefore: {
          args: new Date().toISOString().split('T')[0],
          msg: 'La date de naissance doit être dans le passé'
        }
      }
    },
    lieuNaissance: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le lieu de naissance ne peut pas être vide'
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
    adresse: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    niveau: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le niveau ne peut pas être vide'
        },
        isIn: {
          args: [['L1', 'L2', 'L3', 'M1', 'M2', 'D1', 'D2', 'D3']],
          msg: 'Le niveau doit être: L1, L2, L3, M1, M2, D1, D2 ou D3'
        }
      }
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
    modelName: 'Etudiant',
    tableName: 'etudiants',
    timestamps: true,
    hooks: {
      beforeValidate: (etudiant) => {
        if (etudiant.email) {
          etudiant.email = etudiant.email.toLowerCase();
        }
        if (etudiant.matricule) {
          etudiant.matricule = etudiant.matricule.toUpperCase();
        }
        if (etudiant.niveau) {
          etudiant.niveau = etudiant.niveau.toUpperCase();
        }
      }
    }
  });

  return Etudiant;
};