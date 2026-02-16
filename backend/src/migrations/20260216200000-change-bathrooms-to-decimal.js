'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change bathrooms column from INTEGER to DECIMAL(3,1) to allow values like 0, 0.5, 1, 1.5, etc.
    // Also make it nullable since bathrooms is optional
    await queryInterface.changeColumn('Properties', 'bathrooms', {
      type: Sequelize.DECIMAL(3, 1),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert back to INTEGER (but keep allowNull: true since it was optional)
    await queryInterface.changeColumn('Properties', 'bathrooms', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};

