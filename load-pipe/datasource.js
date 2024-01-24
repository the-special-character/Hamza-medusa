// Manual Migration to add ETH currency
// https://docs.medusajs.com/development/entities/migrations/create

const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "postgres",
  port: 5432,
  username: "garonazarian",
  password: "newpassword",
  database: "medusa-NvEk",
  entities: ["dist/models/*.js"],
  migrations: ["dist/migrations/*.js"],
});

module.exports = {
  datasource: AppDataSource,
};
