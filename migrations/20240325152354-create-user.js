"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: `Opps!, please specify an email address` },
          isEmail: { msg: `Opps!, please enter a valid email address` },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Opps!. This is a required field." },
          notEmpty: { msg: "Opps!. This is a required field." },
          min: 5,
        },
      },
      stack: DataTypes.STRING,
      avatar: { type: DataTypes.STRING, allowNull: true },
      location: { type: DataTypes.STRING, allowNull: true },
      password_updated_at: DataTypes.STRING,
      email_verified_at: DataTypes.DATE,
      email_verification_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email_verification_token_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      password_reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password_reset_token_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
