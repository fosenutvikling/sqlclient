import { mssql, mysql, pgsql, sqlite } from '../src/SqlScripts';
import { DatabaseStorage } from '../src/Storage';

jest.mock('../src/SqlScripts', () => ({
    mysql: jest.fn(),
    mssql: jest.fn(),
    pgsql: jest.fn(),
    sqlite: jest.fn()
}));

describe('Storage class', () => {
    beforeEach(() => {
        (mysql as any).mockClear();
        (mssql as any).mockClear();
        (pgsql as any).mockClear();
        (sqlite as any).mockClear();
    });
    it('should recognize driver', () => {
        (DatabaseStorage as any).getCreateTableSql('mysql', 'unknown');
        expect(mysql).toBeCalledTimes(1);

        (DatabaseStorage as any).getCreateTableSql('mssql', 'unknown');
        expect(mssql).toBeCalledTimes(1);

        (DatabaseStorage as any).getCreateTableSql('postgres', 'unknown');
        expect(pgsql).toBeCalledTimes(1);

        (DatabaseStorage as any).getCreateTableSql('sqlite', 'unknown');
        expect(sqlite).toBeCalledTimes(1);
    });

    it('should throw error on unknown driver', () => {
        expect(() =>
            (DatabaseStorage as any).getCreateTableSql('unknown', 'unknown')
        ).toThrowError();
    });

    //    Expect(mockMysql).toBeCalled();
});
