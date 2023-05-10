import React from 'react';
import { render, fireEvent, screen } from "@testing-library/react";
import JoinsMenu from './JoinsMenu';
import {JOIN_TYPES} from "../../../../../context/DbQueryConsts";
import '@testing-library/jest-dom/extend-expect';

describe('JoinsMenu', () => {
    test('renders JoinsMenu component with join types', () => {
        render(<JoinsMenu />);

        const joinLabel = screen.getByText("Join types:");
        expect(joinLabel).toBeInTheDocument();

        JOIN_TYPES.forEach(joinType => {
            expect(screen.getByText(joinType)).toBeInTheDocument();
        });
    });

    test('triggers drag start event for join types', () => {
        render(<JoinsMenu />);
        const dataTransferMock = {
            setData: jest.fn(),
        };

        JOIN_TYPES.forEach(joinType => {
            const joinTypeElement = screen.getByText(joinType);
            fireEvent.dragStart(joinTypeElement, { dataTransfer: dataTransferMock });
            expect(dataTransferMock.setData).toHaveBeenCalledWith("joinType", joinType);
        });
    });
});
