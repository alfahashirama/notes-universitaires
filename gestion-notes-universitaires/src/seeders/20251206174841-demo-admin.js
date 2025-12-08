'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    await queryInterface.bulkInsert('utilisateurs', [
      {
        id: uuidv4(),
        nom: 'ADMIN',
        prenom: 'Super',
        email: 'admin@universite.mg',
        password: hashedPassword,
        role: 'admin',
        departementId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        nom: 'RAKOTO',
        prenom: 'Jean',
        email: 'enseignant@universite.mg',
        password: hashedPassword,
        role: 'enseignant',
        departementId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        nom: 'RABE',
        prenom: 'Paul',
        email: 'etudiant@universite.mg',
        password: hashedPassword,
        role: 'etudiant',
        departementId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('utilisateurs', null, {});
  }
};