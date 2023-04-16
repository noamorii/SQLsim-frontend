import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {DbContext} from "../../../context/context";
import {executeQueryValues} from "../../../context/commonFunctions";
import {SELECT_TABLES_QRY} from "../../../context/DbQueryConsts";
import './FromQueryForm.css';

const startElements = [<div className="start element">FROM</div>];
const FromQueryForm = () => {

    const [elements, setElements] = useState(startElements);
    const {db} = useContext(DbContext);
    const [tables, setTables] = useState([]);
    const [queryError, setQueryError] = useState(null);
    const {register, handleSubmit} = useForm();

    const fetchTables = useMemo(() => {
        return async () => {
            const allTables = await executeQueryValues(db, SELECT_TABLES_QRY);
            setTables(allTables);
        };
    }, [db]);

    useEffect(() => {
        fetchTables().catch((error) => {
            console.error('Error fetching tables:', error);
        });
    }, [fetchTables]);

    const onSubmitFrom = (data) => {
        const query = buildQuery(data, elements);
        handleQuery(query);
    }

    const handleQuery = (query) => {
        try {
            db.exec(query);
            setQueryError(null);
        } catch (err) {
            setQueryError(err);
        }
    }

    const buildQuery = (data, elements) => {
        const queryComponents = elements
            .map((element, i) => {
                if (i % 2 !== 0) {
                    const key = `${i}_tables` in data ? `${i}_tables` : `${i}_input`;
                    return data[key];
                }
                return element.props.children;
            })
        return ["SELECT *", ...queryComponents].join(" ");
    };

    const getNewElement = (element) => {
        if (/^(table|attribute)/.test(element.props.className))
            return [<div className="placement element">Place join here</div>];
        return createSelectTable();
    };

    const updateElements = (lastElement) => {
        if (lastElement.props.className.includes('placement')) return;
        const newElement = getNewElement(lastElement);
        setElements((prevElements) => [...prevElements, ...newElement]);
    };

    const handlePlus = () => {
        if (tables.length === 0) return;
        const lastElement = elements.at(-1);
        updateElements(lastElement);
    };

    const renderTableOptions = () => {
        return tables.map((table, i) => (
            <option key={i} value={table}>
                {table}
            </option>
        ));
    };

    const createAsParameter = () => {
        return [
            <div className="start element">AS</div>,
            <input type="text" className="attribute as element"
                   {...register((elements.length + 2) + "_input", {
                       required: true
                   })}
            />
        ]
    }

    const createSelectTable = () => {
        if (tables.length === 0) return;
        return [
            <select
                onDrop={handleDrop}
                className="table element" form="form"
                name="tables" id="tables" defaultValue=""
                {...register(elements.length + "_tables")}
            >
                {renderTableOptions()}
                <option disabled hidden key={"choose"} value="">
                    Choose table
                </option>
            </select>,
            ...createAsParameter()
        ];
    };

    function createJoin(joinType) {
        return [
            <div className="join element">{joinType}</div>,
            ...createSelectTable(),
            <div className="start element">ON</div>,
            <input type="text" className="attribute element"
                   {...register((elements.length + 4) + "_input", {
                       required: true
                   })}
            />,
            <div className="start element">=</div>,
            <input type="text" className="attribute element"
                   {...register((elements.length + 6) + "_input", {
                       required: true
                   })}
            />
        ];
    }

    const updateElementsWithJoin = (lastElement, joinType) => {
        if (lastElement && lastElement.props.className.includes("placement")) {
            const newElements = createJoin(joinType);
            const updatedElements = [...elements.slice(0, -1), ...newElements];
            setElements(updatedElements);
        }
    };

    const handleDrop = (e) => {
        dropHandler(e)
    };


    function dropHandler(e) {
        e.preventDefault();
        const lastElement = elements.at(-1);
        const joinType = e.dataTransfer.getData("joinType")
        updateElementsWithJoin(lastElement, joinType);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    return (
        <div>
            <form id="form" className="queryContainer"
                  onSubmit={onSubmitFrom}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
            >
                <div className="disabled element">SELECT</div>
                <div className="disabled element">*</div>
                {elements.map((element, index) => (<div key={index}>{element}</div>))}
                <div className="element plus_button" onClick={handlePlus}>+</div>
            </form>
            <button onClick={handleSubmit(onSubmitFrom)}>Validate</button>
            {queryError && (
                <div className="error">
                    {queryError.toString()}
                </div>
            )}
        </div>

    );
};

export default FromQueryForm;
