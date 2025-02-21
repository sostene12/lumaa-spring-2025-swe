"use strict";
import bcrypt from "bcrypt";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hash1 = await bcrypt.hash("lamaatestuser1", salt);
    const hash2 = await bcrypt.hash("lamaatestuser2", salt);
    await queryInterface.bulkInsert("Users", [
      {
        username: "lamaatestuser1",
        password: hash1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "lamaatestuser2",
        password: hash2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
