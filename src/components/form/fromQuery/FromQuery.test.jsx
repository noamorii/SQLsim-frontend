import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DbContext } from "../../../context/context";
import FromQueryForm from './FromQueryForm';
import { SqlContext } from "../../../context/context";
import '@testing-library/jest-dom';
import * as commonFunctions from '../../../context/commonFunctions';

describe('FromQueryForm Component', () => {
    let mockDb, mockSql;
    const mockShowResultTable = jest.fn();
    const mockClearResultTable = jest.fn();

    beforeEach(() => {
        // Mocking the database object
        mockDb = {
            exec: jest.fn(),
        };
        mockSql = {
            Database: function() { return mockDb; },
        };
    });

    it('should render form correctly', () => {
        render(
            <SqlContext.Provider value={{ sql: mockSql, setSql: jest.fn() }}>
            <DbContext.Provider value={{ db: mockDb}}>
                <FromQueryForm showResultTable={mockShowResultTable} clearResultTable={mockClearResultTable} />
            </DbContext.Provider>
            </SqlContext.Provider>
        );

        expect(screen.getByText('SELECT')).toBeInTheDocument();
        expect(screen.getByText('*')).toBeInTheDocument();
        expect(screen.getByText('FROM')).toBeInTheDocument();
        expect(screen.getByText('+')).toBeInTheDocument();
    });

    it('should display an error when the "+" button is clicked without any table', async () => {
        render(
            <SqlContext.Provider value={{ sql: mockSql, setSql: jest.fn() }}>
                <DbContext.Provider value={{ db: mockDb}}>
                    <FromQueryForm showResultTable={mockShowResultTable} clearResultTable={mockClearResultTable} />
                </DbContext.Provider>
            </SqlContext.Provider>
        );

        const plusButton = screen.getByText('+');
        await userEvent.click(plusButton);

        const errorMessage = await screen.findByText(/please set the tables/);
        expect(errorMessage).toBeInTheDocument();
    });

    it('calls fetchTables on mount', async () => {
        const fetchTablesMock = jest.fn();

        jest.spyOn(React, 'useContext').mockImplementation(() => ({
            db: {},
        }));

        jest.spyOn(commonFunctions, 'executeQueryValues').mockImplementation(fetchTablesMock);

        render(
            <SqlContext.Provider value={{ sql: mockSql, setSql: jest.fn() }}>
                <DbContext.Provider value={{ db: mockDb}}>
                    <FromQueryForm />
                </DbContext.Provider>
            </SqlContext.Provider>
        );

        await waitFor(() => expect(fetchTablesMock).toHaveBeenCalled());
    });

    it('should execute a query successfully when submit button is clicked', async () => {
        const mockQuery = "SELECT * FROM test AS t";

        const mockResult = {
            columns: ['test'],
            values: [['test']]
        };
        mockDb.exec.mockReturnValue([mockResult]);

        // Mock executeQueryValues function
        const executeQueryValuesMock = jest.spyOn(commonFunctions, 'executeQueryValues');
        executeQueryValuesMock.mockReturnValue(['test']);

        render(
            <SqlContext.Provider value={{ sql: mockSql, setSql: jest.fn() }}>
                <DbContext.Provider value={{ db: mockDb}}>
                    <FromQueryForm showResultTable={mockShowResultTable} clearResultTable={mockClearResultTable} />
                </DbContext.Provider>
            </SqlContext.Provider>
        );

        const plusButton = screen.getByText('+');
        await userEvent.click(plusButton);

        const selectElement = screen.getByRole('combobox');
        await userEvent.selectOptions(selectElement, 'test');

        const inputField = screen.getByRole('textbox');
        await userEvent.type(inputField, 't');

        const submitButton = screen.getByText('Run');
        await userEvent.click(submitButton);

        expect(mockDb.exec).toHaveBeenCalledWith(mockQuery);
        expect(executeQueryValuesMock).toHaveBeenCalled();
        expect(mockShowResultTable).toHaveBeenCalled();
    });

    it('should display an error when database throws an error', async () => {
        const mockError = "Mock Error";
        mockDb.exec.mockImplementation(() => { throw new Error(mockError) });
        const executeQueryValuesMock = jest.spyOn(commonFunctions, 'executeQueryValues');
        executeQueryValuesMock.mockReturnValue(['test']);

        render(
            <SqlContext.Provider value={{ sql: mockSql, setSql: jest.fn() }}>
                <DbContext.Provider value={{ db: mockDb}}>
                    <FromQueryForm showResultTable={mockShowResultTable} clearResultTable={mockClearResultTable} />
                </DbContext.Provider>
            </SqlContext.Provider>
        );

        const plusButton = screen.getByText('+');
        await userEvent.click(plusButton);

        const selectElement = screen.getByRole('combobox');
        await userEvent.selectOptions(selectElement, 'test');

        const inputField = screen.getByRole('textbox');
        await userEvent.type(inputField, 't');

        const submitButton = screen.getByText('Run');
        await userEvent.click(submitButton);

        const errorMessage = await screen.findByText(new RegExp(mockError));
        expect(errorMessage).toBeInTheDocument();
    });

    it('should clear the form when the clear button is clicked', async () => {
        const executeQueryValuesMock = jest.spyOn(commonFunctions, 'executeQueryValues');
        executeQueryValuesMock.mockReturnValue(['test']);

        render(
            <SqlContext.Provider value={{ sql: mockSql, setSql: jest.fn() }}>
                <DbContext.Provider value={{ db: mockDb}}>
                    <FromQueryForm showResultTable={mockShowResultTable} clearResultTable={mockClearResultTable} />
                </DbContext.Provider>
            </SqlContext.Provider>
        );

        const plusButton = screen.getByText('+');
        await userEvent.click(plusButton);

        const selectElement = screen.getByRole('combobox');
        await userEvent.selectOptions(selectElement, 'test');

        const clearButton = screen.getByText('Clear');
        await userEvent.click(clearButton);

        expect(mockClearResultTable).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('combobox')).toBeNull();
    });

    it('should save the query to sessionStorage', async () => {
        // Set up mock functions and data
        const mockQuery = "SELECT * FROM test AS t";

        const mockResult = {
            columns: ['test'],
            values: [['test']]
        };
        mockDb.exec.mockReturnValue([mockResult]);

        // Spy on sessionStorage.setItem
        const sessionStorageSpy = jest.spyOn(Storage.prototype, 'setItem');

        // Render the component
        render(
            <SqlContext.Provider value={{ sql: mockSql, setSql: jest.fn() }}>
                <DbContext.Provider value={{ db: mockDb }}>
                    <FromQueryForm
                        showResultTable={mockShowResultTable}
                        clearResultTable={mockClearResultTable}
                    />
                </DbContext.Provider>
            </SqlContext.Provider>
        );

        const plusButton = screen.getByText('+');
        await userEvent.click(plusButton);

        const selectElement = screen.getByRole('combobox');
        await userEvent.selectOptions(selectElement, 'test');

        const inputField = screen.getByRole('textbox');
        await userEvent.type(inputField, 't');

        const submitButton = screen.getByText('Run');
        await userEvent.click(submitButton);

        // Verify sessionStorage.setItem was called with the expected arguments
        expect(sessionStorageSpy).toHaveBeenCalledWith('savedFromQuery', JSON.stringify(mockQuery));
        sessionStorageSpy.mockRestore();
    });
});
