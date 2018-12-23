import Chalk from 'chalk';
import { Connection, ConnectionStruct } from 'database-js';

const debugString = Chalk.cyan;

interface IClientOptions extends ConnectionStruct {
    debug?: boolean;
}

type Arg = string | number | boolean | {};
export class DatabaseClient {
    private static clientInstance: DatabaseClient;
    private static dbOptions: IClientOptions;

    public static set options(options: IClientOptions) {
        this.dbOptions = options;
    }

    public static get instance() {
        if (this.clientInstance == null) this.clientInstance = new DatabaseClient();

        return this.clientInstance;
    }

    private connection: Connection;

    private constructor() {
        this.connection = new Connection(DatabaseClient.dbOptions);
    }

    private logSql(sql: string, args: Arg[], end = false) {
        if (DatabaseClient.dbOptions.debug) {
            const fn = end ? console.timeEnd : console.time;
            fn(`${debugString('SQL:')} ${sql} `);
            if (end && args.length) console.debug(debugString('Arguments:'), args);
        }
    }

    public async query<TResult = Array<{}>>(sql: string, ...args: Arg[]) {
        const statement = this.connection.prepareStatement(sql);

        this.logSql(sql, args);
        const result = await statement.query(...args);
        this.logSql(sql, args, true);

        return (result as unknown) as TResult;
    }

    public async beginTransaction() {
        return this.connection.beginTransaction();
    }

    public async rollback() {
        if (this.connection.inTransaction()) return this.connection.rollback();

        throw new Error('Using `rollback` requires a transaction to be started');
    }

    public async commit() {
        if (this.connection.inTransaction()) return this.connection.commit();

        throw new Error('Using `commit` requires a transaction to be started');
    }

    public getConnection() {
        return this.connection;
    }
}
