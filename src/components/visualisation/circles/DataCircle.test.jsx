import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataCircle from './DataCircle';
import '@testing-library/jest-dom/extend-expect';

expect.extend({
    toHaveStyle(received, property, value) {
        const style = received.style[property];
        if (value === undefined) {
            return {
                pass: style !== '',
                message: () => `Expected element to have non-empty ${property} style, but it was empty.`,
            };
        } else {
            return {
                pass: style === value,
                message: () =>
                    `Expected element to have ${property} style "${value}", but got "${style}".`,
            };
        }
    },
});

describe('DataCircle', () => {
    const mockValueObject = {
        column1: 'Value 1',
        column2: 'Value 2',
        column3: 'Value 3',
    };

    const mockText = 'Circle Text';
    const mockTop = 100;
    const mockLeft = 200;
    const mockBackgroundColor = 'red';

    it('renders the circle with the provided text and style', () => {
        render(
            <DataCircle
                valueObject={mockValueObject}
                text={mockText}
                top={mockTop}
                left={mockLeft}
                backgroundColor={mockBackgroundColor}
            />
        );

        const circleElement = screen.getByText(mockText);

        expect(circleElement).toBeInTheDocument();
        expect(circleElement).toHaveStyle(`top: ${mockTop}px;`);
        expect(circleElement).toHaveStyle(`left: ${mockLeft}px;`);
        expect(circleElement).toHaveStyle({ backgroundColor: mockBackgroundColor });
    });

    it('shows the popup table on mouse enter and hides it on mouse leave', () => {
        render(
            <DataCircle
                valueObject={mockValueObject}
                text={mockText}
                top={mockTop}
                left={mockLeft}
                backgroundColor={mockBackgroundColor}
            />
        );

        const circleElement = screen.getByText(mockText);
        fireEvent.mouseEnter(circleElement);

        const popupTable = screen.getByRole('table');
        expect(popupTable).toBeInTheDocument();

        fireEvent.mouseLeave(circleElement);
        expect(popupTable).not.toBeInTheDocument();
    });
});
