# @fosenu/sqlclient

A promise abstracted SQL client for Node.js, built on [database-js](https://github.com/mlaanderson/database-js).

## Install

    npm install @fosenu/sqlclient

### Drivers

[database-js](https://github.com/mlaanderson/database-js) supports multiple drivers. To use the different drivers with `@fosenu/sqlclient`, install the needed driver as a dependency. __NOTE:__ The migration class included with `@fosenu/sqlclient` only supports `mysql`, `postgres`, `mssql` and `sqlite`!

For mysql

    npm install database-js-mysql

For postgres

    npm install database-js-postgres

For mssql

    npm install database-js-mssql

For sqlite

    npm install database-js-sqlite

## Usage

### Setup Client

```JS
import { DatabaseClient } from "@fosenu/sqlclient";

DatabaseClient.options = {
    DriverName: 'mysql',
    Hostname: 'localhost',
    Port: '3333',
    Database: 'test',
    Username: 'user',
    Password: 'userpw',
    debug: true
};

```

__Connection Options__
| Option     | Required?                 | Description                                                                                                                                                                                              |
|------------|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| DriverName | Required                  | Type of driver to use, supported by database-js. See [https://github.com/mlaanderson/database-js/wiki/Drivers](https://github.com/mlaanderson/database-js/wiki/Drivers) for a list of supported drivers. |
| Hostname   | Required                  | Host to create connection against                                                                                                                                                                        |
| Port       | Optional                  | Port which the hostname accepts connections to, if necessary                                                                                                                                             |
| Database   | Required                  | Database name                                                                                                                                                                                            |
| Username   | Optional                  | User credential                                                                                                                                                                                          |
| Password   | Optional                  | User credential                                                                                                                                                                                          |
| Debug      | Optional, default `false` | Logs the query, with its execution time to the console                                                                                                                                                       |

Each driver may provide more information about each option field. See [https://github.com/mlaanderson/database-js/wiki/Drivers](https://github.com/mlaanderson/database-js/wiki/Drivers) for more information.


### Query
```JS
const instance = DatabaseClient.instance;

instance.query("SELECT * FROM myDb").then(result=>{
    ...
}).catch(error=>{
    ....
});

```

You can also replace then/catch with async/await. Remember to wrap the query in a try/catch block to catch any errors!

### Transaction

```JS
async function runTransaction() {


await instance.beginTransaction();
    try {
        await instance.query("INSERT INTO myDb SET id = ?", [1]);
        await instance.query("SELECT * FROM myDb");
        await instance.query("DELETE FROM myDb WHERE id = ?", [2]);
        await instance.commit();
    } catch(ex) {
        console.error(ex);
        await instance.rollback();
    }
}

```

__BeginTransaction__



### Migrations

```JS
import { DatabaseMigration } from '@fosenu/sqlclient';

const migration = new DatabaseMigration({
    table: 'migrations',
    directory: '../migration'
});

// Setup migration
await migration.setup();

// Apply all migrations
await migration.up();

// Revoke all applied migrations
await migration.down({
    to: 0
});

// Get a list of pending migrations
await migration.pendingMigrations();

// Get a list of executed migrations
await migration.executedMigrations();
```



## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
