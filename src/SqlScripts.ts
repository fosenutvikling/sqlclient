export const mysql = (table: string) => `CREATE TABLE IF NOT EXISTS ${table} (
    id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL COMMENT "Name of migration",
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),

    PRIMARY KEY(id)
   ) ENGINE=InnoDB;`;

export const pgsql = (table: string) => `CREATE TABLE IF NOT EXISTS ${table} (
    id SERIAL NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
   );`;

export const mssql = (table: string) => `CREATE TABLE IF NOT EXISTS ${table} (
    id IDENTITY NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
   );`;

export const sqlite = (table: string) => `CREATE TABLE IF NOT EXISTS ${table} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at datetime default current_timestamp
   );`;
