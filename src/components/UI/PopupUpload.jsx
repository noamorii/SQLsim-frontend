import React, {useState, useRef, useEffect, useContext} from 'react';
import './PopupUpload.css';
import DbFileUploadButton from "./Buttons/DbFileUploadButton";
import {DbContext, SqlContext} from "../context/context";
import {ALL_TABLES_QRY} from "../context/DbQueryConsts";

function PopupUpload() {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const [error, setError] = useState(null);
    const popupRef = useRef();
    const {db, setDb} = useContext(DbContext);
    const {sql} = useContext(SqlContext);

    useEffect(() => {
        const handleMouseDown = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        window.addEventListener('mousedown', handleMouseDown);
        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, [popupRef]);

    const handleChange = (event) => {
        setText(event.target.value);
        setError(null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        try {
            if (db.exec(ALL_TABLES_QRY).length === 0 && text.trim() === '') {
                setError('Please upload a database file or enter table schemas.');
                return;
            }
            const newDb = new sql.Database();
            setDb(newDb);
            newDb.exec(text);
            setError(null);
            setIsOpen(false);
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div>
            <button onClick={() => setIsOpen(true)}>Open Popup</button>
            {isOpen && (
                <div className="popup-container" ref={popupRef}>
                    <div className="popup-content">
                        <button className="close-btn" onClick={() => setIsOpen(false)}>X</button>
                        <h2>Upload database</h2>
                        <form>
                            <div className="input-container">
                                <p>Enter SQLite database table schemas:</p>
                                <textarea style={{resize: 'none'}} value={text} onChange={handleChange}/>
                            </div>
                            <div className="errorMessage">
                                {(error || "").toString()}
                            </div>
                            <div className="button-container">
                                <DbFileUploadButton className="upload-btn"/>
                                <button className="submit-btn" type="submit" onClick={handleSubmit}>
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isOpen && <div className="overlay"/>}
        </div>
    );
}

export default PopupUpload;
