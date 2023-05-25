import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DbContext } from '../../../context/context';
import DbFileDownloadButton from './DbFileDownloadButton';
import Button from "./Button";

jest.mock('./Button', () => jest.fn());

describe('DbFileDownloadButton', () => {
    beforeEach(() => {
        // Mock the Button component
        Button.mockImplementation(({onClick}) => (
            <div onClick={onClick}>Mock Button</div>
        ));

        // Mock Blob
        global.Blob = function(content, options = {}) {
            return {
                content: content,
                options: options,
                size: content.length,
                type: options.type || ""
            };
        };

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the button and triggers the download function', () => {
        const mockDb = {
            export: jest.fn()
        };

        // Mock createObjectURL
        global.URL.createObjectURL = jest.fn();


        const { getByText } = render(
            <DbContext.Provider value={{ db: mockDb }}>
                <DbFileDownloadButton />
            </DbContext.Provider>
        );

        fireEvent.click(getByText('Mock Button'));
        expect(mockDb.export).toHaveBeenCalledTimes(1);
    });
});

