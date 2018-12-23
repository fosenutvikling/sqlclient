import { Connection } from 'database-js';
import { Storage } from 'umzug';
import { mssql, mysql, pgsql, sqlite } from './SqlScripts';

interface IOptions {
    table: string;
    connection: Connection;
}

type Driver = 'mysql' | 'mssql' | 'postgres' | 'sqlite';

export class DatabaseStorage implements Storage {
    private table: string;
    private connection: Connection;
    private driverType: Driver;

    private isTableCreated: boolean;

    public constructor(options: IOptions) {
        this.table = options.table;
        this.connection = options.connection;
        this.isTableCreated = false;
        this.driverType = (options.connection as any).__base.DriverName;

        this.setup();
    }

    private static getCreateTableSql(driverType: Driver, tableName: string) {
        switch (driverType) {
            case 'mysql':
                return mysql(tableName);
            case 'mssql':
                return mssql(tableName);
            case 'postgres':
                return pgsql(tableName);
            case 'sqlite':
                return sqlite(tableName);
            default:
                throw new Error(`Driver not recognized: ${driverType}`);
        }
    }

    private async setup() {
        await this.createTable();
    }

    private async createTable() {
        const sql = DatabaseStorage.getCreateTableSql(this.driverType, this.table);

        const statement = this.connection.prepareStatement(sql);
        await statement.execute();

        this.isTableCreated = true;
    }

    private async createTableIfNecessary() {
        if (!this.isTableCreated) await this.createTable();
    }

    public async logMigration(migrationName: string): Promise<void> {
        await this.createTableIfNecessary();
        const sql = `INSERT INTO ${this.table} SET name = ?;`;
        const statement = this.connection.prepareStatement(sql);
        await statement.execute(migrationName);
    }

    public async unlogMigration(migrationName: string): Promise<void> {
        await this.createTableIfNecessary();
        const sql = `DELETE FROM ${this.table} WHERE name = ?;`;
        const statement = this.connection.prepareStatement(sql);
        await statement.query(migrationName);
    }

    public async executed(): Promise<string[]> {
        await this.createTableIfNecessary();
        const sql = `SELECT id,name,created_at FROM ${this.table} ORDER BY created_at DESC`;
        const statement = this.connection.prepareStatement(sql);
        const result = await statement.query();

        return result.map(({ name }) => name);
    }
}
