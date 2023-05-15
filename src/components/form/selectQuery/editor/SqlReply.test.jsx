import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SqlReply from './SqlReply';
import {DbContext, SqlContext} from "../../../../context/context";
import {BrowserRouter as Router} from "react-router-dom";

describe('SqlReply', () => {
    let mockDb, mockSql;

    beforeEach(() => {
        // Mocking the database object
        jest.clearAllMocks();
        mockDb = {
            exec: jest.fn(),
        };
        mockSql = {
            Database: function() { return mockDb; },
        };

    });

    it('renders the component correctly', () => {
        const { getByText } = render(
            <SqlContext.Provider value={{ sql: mockSql, setSql: jest.fn() }}>
                <DbContext.Provider value={{ db: mockDb}}>
                    <Router><SqlReply /></Router>
                </DbContext.Provider>
            </SqlContext.Provider>
        );

        // Check if the query playground and visualization sections are rendered
        expect(getByText('Please create a from query')).toBeInTheDocument();
        expect(getByText('Show All')).toBeInTheDocument();
        expect(getByText('Clear')).toBeInTheDocument();
        expect(getByText('Copy')).toBeInTheDocument();
        expect(getByText('Run')).toBeInTheDocument();
    });
});
