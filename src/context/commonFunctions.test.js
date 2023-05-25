import { executeQueryValues, executeQuery, getStoredQuery } from './commonFunctions';

const mockExec = jest.fn();
const mockDb = { exec: mockExec };

let storageMock = {};
const sessionStorageMock = {
    getItem: (key) => key in storageMock ? JSON.parse(storageMock[key]) : null,
    setItem: (key, value) => storageMock[key] = JSON.stringify(value),
    removeItem: (key) => delete storageMock[key],
    clear: () => storageMock = {},
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });


describe('executeQueryValues', () => {
    it('should execute the SQL query and return the values', () => {
        mockExec.mockReturnValue([{ values: ['result1', 'result2'] }]);
        const result = executeQueryValues(mockDb, 'SELECT * FROM table');
        expect(result).toEqual(['result1', 'result2']);
        expect(mockExec).toHaveBeenCalledWith('SELECT * FROM table');
    });

    it('should return an empty array if an error occurs', () => {
        mockExec.mockImplementation(() => {
            throw new Error('Database error');
        });
        const result = executeQueryValues(mockDb, 'SELECT * FROM table');
        expect(result).toEqual([]);
    });
});

describe('executeQuery', () => {
    it('should execute the SQL query and return the result object', () => {
        mockExec.mockReturnValue([{ columns: ['column1', 'column2'], values: ['value1', 'value2'] }]);
        const result = executeQuery(mockDb, 'SELECT * FROM table');
        expect(result).toEqual({ columns: ['column1', 'column2'], values: ['value1', 'value2'] });
        expect(mockExec).toHaveBeenCalledWith('SELECT * FROM table');
    });

    it('should return an object with empty arrays if an error occurs', () => {
        mockExec.mockImplementation(() => {
            throw new Error('Database error');
        });
        const result = executeQuery(mockDb, 'SELECT * FROM table');
        expect(result).toEqual({ columns: [], values: [] });
    });
});

jest.spyOn(sessionStorage, 'getItem');
describe('getStoredQuery', () => {
    it('should return an empty string if no query is found', () => {
        sessionStorage.removeItem('savedSelectQuery');
        const result = getStoredQuery('savedSelectQuery');
        expect(result).toBe('');
        expect(sessionStorage.getItem).toHaveBeenCalledWith('savedSelectQuery');
    });
});
