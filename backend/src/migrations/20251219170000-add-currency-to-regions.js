'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    await queryInterface.addColumn('regions', 'currency', {
      type: Sequelize.STRING,
      allowNull: true,
    }, { transaction });

    await queryInterface.addColumn('regions', 'currencySymbol', {
      type: Sequelize.STRING,
      allowNull: true,
    }, { transaction });

    await transaction.commit();
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    await queryInterface.removeColumn('regions', 'currency', { transaction });
    await queryInterface.removeColumn('regions', 'currencySymbol', { transaction });

    await transaction.commit();
  }
};

