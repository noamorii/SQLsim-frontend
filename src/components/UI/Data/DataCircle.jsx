import "./DataCircle.css"

const DataCircle = ({ valueObject, text, top, left }) => {
    return (
        <div id={`circle-${text}`}
             style={{top, left}}>
            <p>{text}</p>
        </div>
    );
};

export default DataCircle;
