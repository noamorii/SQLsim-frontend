import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Button from './Button';

describe('Button', () => {
    it('renders the button with provided text', () => {
        const { getByText } = render(<Button text="Click Me!" />);
        expect(getByText('Click Me!')).toBeInTheDocument();
    });

    it('calls onClick prop when clicked', () => {
        const handleClick = jest.fn();
        const { getByText } = render(<Button text="Click Me!" onClick={handleClick} />);

        fireEvent.click(getByText('Click Me!'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders the button with provided class', () => {
        const { getByText } = render(<Button text="Click Me!" className="testClass" />);
        const button = getByText('Click Me!');
        expect(button.className).toContain('testClass');
    });

    it('renders the button in disabled state', () => {
        const { getByText } = render(<Button text="Click Me!" disabled={true} />);
        const button = getByText('Click Me!');
        expect(button).toBeDisabled();
    });

    it('renders the button with an icon', () => {
        const testIcon = <span data-testid="icon">Icon</span>;
        const { getByText, getByTestId } = render(<Button text="Click Me!" icon={testIcon} />);
        expect(getByText('Click Me!')).toBeInTheDocument();
        expect(getByTestId('icon')).toBeInTheDocument();
    });
});
