import React from 'react';
import { render } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
    it('renders without error', () => {
        render(<Loader />);
    });
});
