import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OptionsMenu from './OptionsMenu';

describe('OptionsMenu', () => {
    const handleDraggingMock = jest.fn();

    beforeEach(() => {
        handleDraggingMock.mockClear();
    });

    it('renders the component correctly', () => {
        const { getByText } = render(<OptionsMenu handleDragging={handleDraggingMock} />);

        // Check if the labels and options are rendered correctly
        expect(getByText('Basic operations:')).toBeInTheDocument();
        expect(getByText('Output modifications:')).toBeInTheDocument();
        expect(getByText('Conditions:')).toBeInTheDocument();
        expect(getByText('Aggregation functions:')).toBeInTheDocument();
    });

    it('handles dragging and dropping of operations', () => {
        const { getByText } = render(<OptionsMenu handleDragging={handleDraggingMock} />);
        const draggableItem = getByText('SUM()');

        const mockEvent = {
            dataTransfer: {
                setData: jest.fn(),
            },
        };

        // Simulate dragging and dropping an operation
        fireEvent.dragStart(draggableItem, mockEvent);
        fireEvent.dragEnd(draggableItem);

        expect(handleDraggingMock).toHaveBeenCalledTimes(2);
        expect(handleDraggingMock.mock.calls[0][1]).toBe(true); // First call with true
        expect(handleDraggingMock.mock.calls[1][1]).toBe(false); // Second call with false

        expect(mockEvent.dataTransfer.setData).toHaveBeenCalledTimes(1);
        expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith('operation', 'SUM()');
    });
});
