import React from 'react';
import { render, screen } from '@testing-library/react';
import DataCircleContainer from './DataCircleContainer';
import { DbContext } from '../../../context/context';
import '@testing-library/jest-dom/extend-expect';
import DataCircle from "./DataCircle";

describe('DataCircleContainer', () => {
    const mockCircles = [
        <DataCircle key={1} text="1" valueObject={null}
                    left={10} top={10} backgroundColor="#a0b3bd"/>,
        <DataCircle key={2} text="2" valueObject={null}
                    left={11} top={11} backgroundColor="#a0b3bd"/>,
        <DataCircle key={3} text="3" valueObject={null}
                    left={12} top={12} backgroundColor="#a0b3bd"/>,
    ];

    const mockDb = {};
    const mockDataCircleRef = { current: { offsetWidth: 800 } };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the DataCircleContainer component', () => {
        jest.spyOn(React, 'useRef').mockReturnValue(mockDataCircleRef);
        render(
            <DbContext.Provider value={{ db: mockDb }}>
                <DataCircleContainer condition="GROUP BY" />
            </DbContext.Provider>
        );

        const containerElement = screen.getByTestId('circleContainer');

        expect(containerElement).toBeInTheDocument();
    });
});
