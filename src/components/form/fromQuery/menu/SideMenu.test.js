import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SideMenu from './SideMenu';
import {DbContext, SqlContext} from "../../../../context/context";
import { jest } from '@jest/globals';
import '@testing-library/jest-dom/extend-expect';
import {getStoredQuery} from "../../../../context/commonFunctions";

const renderWithRouterAndContext = (ui, { route = '/' } = {}) => {
    const mockDb = null;
    const mockSql = null;

    window.history.pushState({}, 'Test page', route);

    return render(
        <SqlContext.Provider value={{sql: mockSql}}>
            <DbContext.Provider value={{ db: mockDb }}>
                <Router>{ui}</Router>
            </DbContext.Provider>
        </SqlContext.Provider>
    );
};

const localStorageMock = (() => {
    let store = {};
    return {
        getItem(key) {return store[key] || null;},
        setItem(key, value) {store[key] = value.toString();},
        clear() {store = {};}
    };
})();

Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock
});

describe('SideMenu', () => {

    beforeAll(() => {
        window.sessionStorage.clear();
        window.sessionStorage.setItem('savedFromQuery', JSON.stringify("SELECT * FROM table"));
    });

    test('renders SideMenu component with side menu visible', () => {
        renderWithRouterAndContext(<SideMenu />);
        expect(screen.getByText('Create a FROM query')).toBeInTheDocument();
    });

    test('hides and shows side menu when toggled', () => {
        renderWithRouterAndContext(<SideMenu />);
        const sideMenuToggle = screen.getByTestId('sideMenuToggle');

        // Hide side menu
        fireEvent.click(sideMenuToggle);
        expect(screen.queryByText('Create a FROM query')).toBeInTheDocument();
        expect(screen.queryByTestId('editor')).not.toBeInTheDocument();
        expect(screen.queryByTestId('from-table')).not.toBeInTheDocument();
        expect(screen.queryByTestId('query-panel')).not.toBeInTheDocument();

        // Show side menu
        fireEvent.click(sideMenuToggle);
        expect(screen.getByText('Create a FROM query')).toBeInTheDocument();
        expect(screen.queryByTestId('editor')).toBeInTheDocument();
        expect(screen.queryByTestId('from-table')).toBeInTheDocument();
        expect(screen.queryByTestId('query-panel')).toBeInTheDocument();
    });


    test('renders ResultTable or FakeTable based on the showTable state', () => {
        // Mock getStoredQuery and executeQuery
        const originalGetStoredQuery = SideMenu.__proto__.getStoredQuery;
        SideMenu.__proto__.getStoredQuery = jest.fn(() => '');
        const originalExecuteQuery = SideMenu.__proto__.executeQuery;
        SideMenu.__proto__.executeQuery = jest.fn(() => ({ columns: [], values: [] }));

        renderWithRouterAndContext(<SideMenu />);

        expect(screen.getByText('Create and run your query')).toBeInTheDocument();

        // Reset the mocked functions
        SideMenu.__proto__.getStoredQuery = originalGetStoredQuery;
        SideMenu.__proto__.executeQuery = originalExecuteQuery;
    });

    test('renders "Continue" button when there is a current query', () => {
        renderWithRouterAndContext(<SideMenu />);
        const value = getStoredQuery('savedFromQuery');

        expect(value).toEqual("SELECT * FROM table");
        expect(screen.getByText('Continue')).toBeInTheDocument();
    });

    test('should retrieve saved query from session storage', () => {
        const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem');
        const actualValue = getStoredQuery('savedFromQuery');

        expect(actualValue).toEqual("SELECT * FROM table");
        expect(getItemSpy).toBeCalledWith('savedFromQuery');
    });
});
