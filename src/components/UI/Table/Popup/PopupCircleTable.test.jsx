import { render, screen } from '@testing-library/react';
import PopupCircleTable from './PopupCircleTable';
import '@testing-library/jest-dom/extend-expect';

describe('PopupCircleTable', () => {
    const mockData = {
        column1: 'Value 1',
        column2: 'Value 2',
        column3: 'Value 3',
    };

    it('renders the table headers and data correctly', () => {
        const top = 100;
        const left = 200;
        render(<PopupCircleTable data={mockData} top={top} left={left} />);

        const headers = screen.getAllByRole('columnheader');
        const values = screen.getAllByRole('cell');

        expect(headers).toHaveLength(3);
        expect(values).toHaveLength(3);

        expect(headers[0]).toHaveTextContent('column1');
        expect(headers[1]).toHaveTextContent('column2');
        expect(headers[2]).toHaveTextContent('column3');

        expect(values[0]).toHaveTextContent('Value 1');
        expect(values[1]).toHaveTextContent('Value 2');
        expect(values[2]).toHaveTextContent('Value 3');
    });

    it('sets the correct style for the container element', () => {
        const top = 100;
        const left = 200;
        render(<PopupCircleTable data={mockData} top={top} left={left} />);

        const container = screen.getByTestId('popup-table-container');

        expect(container).toHaveStyle(`top: ${top - 50}px`);
        expect(container).toHaveStyle(`left: ${left + 30}px`);
    });
});
