import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
import '@testing-library/jest-dom/extend-expect';

describe('Navbar', () => {
    it('renders navigation links', () => {
        render(
            <Router>
                <Navbar />
            </Router>
        );

        const homeLink = screen.getByText('Home');
        const tablesLink = screen.getByText('Tables');
        const editorLink = screen.getByText('SQL Editor');

        expect(homeLink).toBeInTheDocument();
        expect(tablesLink).toBeInTheDocument();
        expect(editorLink).toBeInTheDocument();
    });

    it('renders logo link', () => {
        render(
            <Router>
                <Navbar />
            </Router>
        );

        const logoLink = screen.getByText('SQL Simulator');
        const logoLinkHref = logoLink.getAttribute('href');

        expect(logoLink).toBeInTheDocument();
        expect(logoLinkHref).toBe('/');
    });
});
