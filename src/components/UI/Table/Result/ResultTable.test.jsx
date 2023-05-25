import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultTable from './ResultTable';
import '@testing-library/jest-dom/extend-expect';

describe('ResultTable', () => {
    const mockResult = {
        data: {
            columns: ['Id', 'Name', 'Age'],
            values: [
                [1, 'John', 25],
                [2, 'Jane', 30],
            ],
        },
    };

    it('renders the table with correct column headers and data', () => {
        render(<ResultTable result={mockResult} />);

        const tableElement = screen.getByRole('table');
        const columnHeaders = screen.getAllByRole('columnheader');
        const cells = screen.getAllByRole('cell');

        expect(tableElement).toBeInTheDocument();
        expect(columnHeaders).toHaveLength(4);
        expect(cells).toHaveLength(16);
    });

    it('renders the "No results available" message when result is empty', () => {
        render(<ResultTable result={null} />);

        const messageElement = screen.getByText('No results available');
        expect(messageElement).toBeInTheDocument();
    });
});
