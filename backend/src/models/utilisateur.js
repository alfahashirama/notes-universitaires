'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    static associate(models) {
      // Un utilisateur peut appartenir à un département
      Utilisateur.belongsTo(models.Departement, {
        foreignKey: 'departementId',
        as: 'departement'
      });
    }

    // Méthode pour vérifier le mot de passe
    async comparePassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    // Méthode pour obtenir le nom complet
    get nomComplet() {
      return `${this.prenom} ${this.nom}`;
    }

    // Masquer le mot de passe lors de la sérialisation JSON
    toJSON() {
      const values = Object.assign({}, this.get());
      delete values.password;
      return values;
    }
  }

  Utilisateur.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le nom ne peut pas être vide'
        }
      }
    },
    prenom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le prénom ne peut pas être vide'
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
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le mot de passe ne peut pas être vide'
        },
        len: {
          args: [6, 255],
          msg: 'Le mot de passe doit contenir au moins 6 caractères'
        }
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'enseignant', 'etudiant', 'scolarite'),
      allowNull: false,
      defaultValue: 'etudiant',
      validate: {
        isIn: {
          args: [['admin', 'enseignant', 'etudiant', 'scolarite']],
          msg: 'Le rôle doit être: admin, enseignant, etudiant ou scolarite'
        }
      }
    },
    departementId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Utilisateur',
    tableName: 'utilisateurs',
    timestamps: true,
    hooks: {
      beforeCreate: async (utilisateur) => {
        if (utilisateur.password) {
          const salt = await bcrypt.genSalt(10);
          utilisateur.password = await bcrypt.hash(utilisateur.password, salt);
        }
        if (utilisateur.email) {
          utilisateur.email = utilisateur.email.toLowerCase();
        }
      },
      beforeUpdate: async (utilisateur) => {
        if (utilisateur.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          utilisateur.password = await bcrypt.hash(utilisateur.password, salt);
        }
        if (utilisateur.changed('email')) {
          utilisateur.email = utilisateur.email.toLowerCase();
        }
      }
    }
  });

  return Utilisateur;
};