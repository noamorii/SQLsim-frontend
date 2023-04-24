import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {DbContext} from "../../../context/context";
import {executeQueryValues} from "../../../context/commonFunctions";
import {SELECT_TABLES_QRY} from "../../../context/DbQueryConsts";
import './FromQueryForm.css';
import PopupUpload from "../../Popup/PopupUpload";
import DbFileDownloadButton from "../../Buttons/DbFileDownloadButton";
import Button from "../../Buttons/Button";
import {AiFillDelete} from "react-icons/ai";
import {VscDebugStart} from "react-icons/vsc";

const startElements = [<div className="start element">FROM</div>];
const FromQueryForm = ({showResultTable, clearResultTable}) => {
    const {db} = useContext(DbContext);

    const [elements, setElements] = useState(startElements);
    const [queryError, setQueryError] = useState(null);
    const [tables, setTables] = useState([]);

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

    useEffect(() => {
        if (queryError) {
            const timer = setTimeout(() => {
                setQueryError(null);
            }, 5000); // Clear the error after 5 seconds

            // Clean up the effect when the component is unmounted or the error changes
            return () => {
                clearTimeout(timer);
            };
        }
    }, [queryError]);

    const createElementFromData = (elementsJson) => {
        let parsedComponents = [];
        for (const element of elementsJson) {

            if (element.type === "div") {
                parsedComponents.push(<div className={element.props.className}>{element.props.children}</div>)
                continue;
            }

            if (element.type === "select") {
                const options = element.props.children.flat().map((option, index) => (
                    <option
                        key={option.key || index}
                        value={option.props.value}
                        disabled={option.props.disabled}
                        hidden={option.props.hidden}
                    >
                        {option.props.children}
                    </option>
                ));

                parsedComponents.push(
                    <select
                        onDrop={handleDrop}
                        className={element.props.className}
                        form={element.props.form}
                        name={element.props.name}
                        id={element.props.id}
                        defaultValue={element.props.defaultValue}
                        {...register(parsedComponents.length + "_tables", {
                            required: true
                        })}
                    >
                        {options}
                    </select>
                );
                continue;
            }

            if (element.type === "input") {
                parsedComponents.push(
                    <input type={element.props.type} className={element.props.className}
                           {...register((parsedComponents.length) + "_input", {
                               required: true
                           })}
                    />
                );
            }
        }
        return parsedComponents;
    };

    useEffect(() => {
        const savedElements = sessionStorage.getItem('savedFromElements');
        if (savedElements) {
            const parsedElements = JSON.parse(savedElements);
            const reactElements = createElementFromData(parsedElements);
            setElements(reactElements);
        }
    }, []);

    const onSubmitFrom = (data) => {
        const query = buildQuery(data, elements);
        handleQuery(query);
    }

    const handleQuery = (query) => {
        try {
            db.exec(query);
            sessionStorage.setItem('savedFromElements', JSON.stringify(elements));
            sessionStorage.setItem('savedFromQuery', JSON.stringify(query));
            clearResultTable();
            showResultTable();
            setQueryError(null);
        } catch (err) {
            clearResultTable();
            sessionStorage.removeItem('savedFromElements');
            sessionStorage.removeItem('savedFromQuery');
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
        if (/^(table|attribute)/.test(element.props.className)) {
            const plus = document.getElementById("plus");
            plus.classList.add("disabled");
            return [<div className="placement element">Place join here</div>];
        }
        return createSelectTable();
    };

    const updateElements = (lastElement) => {
        if (lastElement.props.className.includes('placement')) {
            setQueryError(new Error("please place a join"));
            return;
        }
        const newElement = getNewElement(lastElement);
        setElements((prevElements) => [...prevElements, ...newElement]);
    };

    const handlePlus = () => {
        if (tables.length === 0) {
            setQueryError(new Error("please set the tables"))
            return;
        }
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
                {...register(elements.length + "_tables", {
                    required: true
                })}
            >
                {renderTableOptions()}
                <option disabled hidden key={"choose"} value="">
                    Choose table
                </option>
            </select>,
            ...createAsParameter()
        ];
    };

    const createJoin = joinType => {
        let elements = [
            <div className="join element">{joinType}</div>,
            ...createSelectTable()
        ];

        if (joinType === "NATURAL JOIN") return elements;

        return [
            ...elements,
            <div className="start element">ON</div>,
            <input type="text" className="attribute element"
                   {...register((elements.length + 4) + "_input", {
                       required: true
                   })}
            />,
            <div className="start element">=</div>,
            <input type="text" className="attribute element"
                   {...register((elements.length + 6) + "_input", {
                       required: true,
                   })}
            />
        ];
    };

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

    const dropHandler = e => {
        e.preventDefault();
        const lastElement = elements.at(-1);
        const joinType = e.dataTransfer.getData("joinType")
        updateElementsWithJoin(lastElement, joinType);
        const element = document.getElementById("plus");
        element.classList.remove("disabled");
    };

    const handleDragOver = e => {
        e.preventDefault();
    };

    const handleClear = () => {
        setQueryError(null);
        clearResultTable();
        sessionStorage.removeItem('savedFromQuery');
        setElements(startElements);
    };

    return (
        <div className="queryFormComponent">
            <form id="form" className="queryContainer"
                  onSubmit={onSubmitFrom}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
            >
                <div className="disabled element">SELECT</div>
                <div className="disabled element">*</div>
                {elements.map((element, index) => (<div key={index}>{element}</div>))}
                <div id="plus" className="element plus_button" onClick={handlePlus}>+</div>
            </form>
            {queryError && (<div className="query-error"> {queryError.toString()}.</div>)}
            <div className="button-panel">
                <PopupUpload/>
                <DbFileDownloadButton/>
                <Button onClick={handleClear} text="Clear" icon={<AiFillDelete/>}/>
                <Button onClick={() => {
                    handleSubmit(onSubmitFrom)();
                    showResultTable();
                }} text="Run" icon={<VscDebugStart/>}/>
            </div>
        </div>
    );
};

export default FromQueryForm;
