import React from 'react';
import { render, screen } from '@testing-library/react';
import FakeTable from './FakeTable';
import '@testing-library/jest-dom/extend-expect';

describe('FakeTable', () => {
    const mockMessage = 'This is a custom message';

    it('renders the custom message correctly', () => {
        render(<FakeTable message={mockMessage} />);

        const messageElement = screen.getByText(mockMessage);
        expect(messageElement).toBeInTheDocument();
    });

    it('renders the fake table with the correct data', () => {
        render(<FakeTable message={mockMessage} />);

        const tableElement = screen.getByRole('table');
        const columnHeaders = screen.getAllByRole('columnheader');
        const cells = screen.getAllByRole('cell');

        expect(tableElement).toBeInTheDocument();
        expect(columnHeaders).toHaveLength(4);
        expect(cells).toHaveLength(16);

        expect(cells[0]).toHaveTextContent('1');
        expect(cells[1]).toHaveTextContent('Cars');
        expect(cells[2]).toHaveTextContent('Data');
        expect(cells[3]).toHaveTextContent('House');
    });
});
