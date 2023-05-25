import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Visualization from './Visualization';
import { getStoredQuery } from '../../context/commonFunctions';
import { DbContext } from '../../context/context';
import '@testing-library/jest-dom/extend-expect';

const mockDb = {};
jest.mock('../../context/commonFunctions');

describe('Visualization', () => {
    beforeEach(() => {
        getStoredQuery.mockReturnValue('SELECT FROM');
    });

    it('renders correctly', () => {
        render(
            <DbContext.Provider value={{ db: mockDb }}>
                <Visualization />
            </DbContext.Provider>
        );
        expect(screen.getByText('All elements')).toBeInTheDocument();
        expect(screen.getByText('Back')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('allows navigation to next condition when possible', () => {
        render( <DbContext.Provider value={{ db: mockDb }}>
            <Visualization />
        </DbContext.Provider>);
        fireEvent.click(screen.getByText('Next'));
        expect(screen.getByText('Result elements')).toBeInTheDocument();
    });

    it('allows navigation to previous condition when possible', () => {
        render( <DbContext.Provider value={{ db: mockDb }}>
            <Visualization />
        </DbContext.Provider>);
        fireEvent.click(screen.getByText('Next'));
        fireEvent.click(screen.getByText('Back'));
        expect(screen.getByText('All elements')).toBeInTheDocument();
    });

    it('disallows navigation to previous condition when not possible', () => {
        render( <DbContext.Provider value={{ db: mockDb }}>
            <Visualization />
        </DbContext.Provider>);
        expect(screen.getByText('Back')).toBeDisabled();
    });
});
