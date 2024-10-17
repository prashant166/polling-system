module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PollOption', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      poll_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Polls',  // References the Poll table
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      option_text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      votes_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PollOption');
  },
};
