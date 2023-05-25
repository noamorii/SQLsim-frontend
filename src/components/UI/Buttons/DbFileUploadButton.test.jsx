import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DbContext, SqlContext } from '../../../context/context';
import DbFileUploadButton from './DbFileUploadButton';

describe('DbFileUploadButton', () => {
    const mockSetDb = jest.fn();
    const mockHandleFileUpload = jest.fn();
    const mockDatabaseInstance = {};
    const mockSql = {
        Database: jest.fn(() => mockDatabaseInstance),
    };

    it('not handles file upload', () => {
        const fileContent = 'file content';
        const file = new File([fileContent], 'test.txt', { type: 'text/plain' });
        const { getByLabelText } = render(
            <DbContext.Provider value={{ setDb: mockSetDb }}>
                <SqlContext.Provider value={{ sql: mockSql }}>
                    <DbFileUploadButton handleFileUpload={mockHandleFileUpload} />
                </SqlContext.Provider>
            </DbContext.Provider>
        );

        const inputFile = getByLabelText('Select File');
        fireEvent.change(inputFile, { target: { files: [file] } });

        expect(mockHandleFileUpload).toHaveBeenCalledTimes(0);
        expect(mockSetDb).toHaveBeenCalledTimes(0);
    });
});
