import React from 'react';

const ResultTable = ({columns, values}) => {
    return (
        <table>
            <thead>
            <tr>
                {columns.map(
                    (columnName, i) => (<td key={i}>{columnName}</td>)
                )}
            </tr>
            </thead>

            <tbody>
                {values.map(
                    (row, i) => ( <tr key={i}> {row.map((value, i) => (<td key={i}>{value}</td>))} </tr> )
                )}
            </tbody>
        </table>
    );
};

export default ResultTable;
