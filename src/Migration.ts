import { readFileSync } from 'fs';
import * as NodePath from 'path';
import Umzug, { DownToOptions, Umzug as UmzugInstance } from 'umzug';
import { DatabaseClient } from './Client';
import { DatabaseStorage } from './Storage';

const pattern: RegExp = /\d.do.*.sql$/;

interface IMigrationOptions {
    table: string;
    directory: string;
}

const defaultOptions: IMigrationOptions = {
    table: 'migrations',
    directory: NodePath.resolve(__dirname, '..', '..', 'migrations')
};

export class DatabaseMigration {
    private umzugInstance?: UmzugInstance;
    private options: IMigrationOptions;

    public constructor(options: IMigrationOptions = defaultOptions) {
        this.options = options;
    }

    private static initializeUmzug({ table, directory }: IMigrationOptions) {
        return new Umzug({
            storage: new DatabaseStorage({
                connection: DatabaseClient.instance.getConnection(),
                table
            }),
            migrations: {
                path: directory,
                pattern,
                customResolver: path => {
                    const downPath = path.replace('do', 'undo');

                    return {
                        up: () => {
                            const fileContent = readFileSync(path, 'utf8');

                            return DatabaseClient.instance.query(fileContent);
                        },
                        down: () => {
                            const fileContent = readFileSync(downPath, 'utf8');

                            return DatabaseClient.instance.query(fileContent);
                        }
                    };
                }
            }
        });
    }

    private get instance() {
        if (!this.umzugInstance) throw new Error('Instance not setup');

        return this.umzugInstance;
    }

    public async setup() {
        this.umzugInstance = DatabaseMigration.initializeUmzug(this.options);
    }

    public async up() {
        return this.instance.up();
    }

    public async down(options?: DownToOptions) {
        return this.instance.down(options);
    }

    public async pendingMigrations() {
        return (await this.instance.pending()).map(({ file }) => file);
    }

    public async executedMigrations() {
        return (await this.instance.executed()).map(({ file }) => file);
    }
}
