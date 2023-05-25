import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PopupUpload from './PopupUpload';
import { DbContext, SqlContext } from '../../../context/context';
import '@testing-library/jest-dom/extend-expect';
import {ALL_TABLES_QRY} from "../../../context/DbQueryConsts";

// Mock the context values
const mockSetDb = jest.fn();
const mockDbExec = jest.fn(() => []);
const mockSql = { Database: jest.fn(() => ({ exec: mockDbExec })) };
const mockDbContextValue = { db: { exec: mockDbExec }, setDb: mockSetDb };
const mockSqlContextValue = { sql: mockSql };
const mockHandleFileUpload = jest.fn();

describe('PopupUpload', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component', () => {
        render(
            <DbContext.Provider value={mockDbContextValue}>
                <SqlContext.Provider value={mockSqlContextValue}>
                    <PopupUpload />
                </SqlContext.Provider>
            </DbContext.Provider>
        );

        const importButton = screen.getByText('Import');
        expect(importButton).toBeInTheDocument();
    });

    it('opens the popup on button click', () => {
        render(
            <DbContext.Provider value={mockDbContextValue}>
                <SqlContext.Provider value={mockSqlContextValue}>
                    <PopupUpload />
                </SqlContext.Provider>
            </DbContext.Provider>
        );

        const importButton = screen.getByText('Import');
        fireEvent.click(importButton);

        const popupContent = screen.getByText('Upload database').closest('.popup-content');
        expect(popupContent).toBeInTheDocument();
    });

    it('closes the popup on close button click', () => {
        render(
            <DbContext.Provider value={mockDbContextValue}>
                <SqlContext.Provider value={mockSqlContextValue}>
                    <PopupUpload />
                </SqlContext.Provider>
            </DbContext.Provider>
        );

        const importButton = screen.getByText('Import');
        fireEvent.click(importButton);

        const closeButton = screen.getByText('X');
        fireEvent.click(closeButton);

        const popupContainer = screen.queryByRole('dialog');
        expect(popupContainer).toBeNull();
    });

    it('handles textarea change', () => {
        render(
            <DbContext.Provider value={mockDbContextValue}>
                <SqlContext.Provider value={mockSqlContextValue}>
                    <PopupUpload />
                </SqlContext.Provider>
            </DbContext.Provider>
        );

        const importButton = screen.getByText('Import');
        fireEvent.click(importButton);

        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: 'schema' } });

        expect(textarea.value).toBe('schema');
    });

    it('handles form submit with file uploaded', () => {
        const mockHandleFileUpload = jest.fn();

        render(
            <DbContext.Provider value={mockDbContextValue}>
                <SqlContext.Provider value={mockSqlContextValue}>
                    <PopupUpload handleFileUpload={mockHandleFileUpload} />
                </SqlContext.Provider>
            </DbContext.Provider>
        );

        const importButton = screen.getByText('Import');
        fireEvent.click(importButton);

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        fireEvent.click(submitButton);

        expect(mockDbExec).toHaveBeenCalled();
        expect(mockSetDb).not.toHaveBeenCalled();
    });

    it('handles form submit without file uploaded', () => {
        render(
            <DbContext.Provider value={mockDbContextValue}>
                <SqlContext.Provider value={mockSqlContextValue}>
                    <PopupUpload handleFileUpload={mockHandleFileUpload} />
                </SqlContext.Provider>
            </DbContext.Provider>
        );

        const importButton = screen.getByText('Import');
        fireEvent.click(importButton);

        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: 'schema' } });

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        fireEvent.click(submitButton);

        expect(mockHandleFileUpload).not.toHaveBeenCalled();
        expect(mockDbExec).toHaveBeenCalledTimes(1);
        expect(mockDbExec).toHaveBeenCalledWith(ALL_TABLES_QRY);
    });
});
