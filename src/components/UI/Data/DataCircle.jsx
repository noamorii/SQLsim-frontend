import style from "./DataCircle.module.css"

const DataCircle = ({ text, top, left }) => {
    return (
        <div id={`circle-${text}`} className={style.circle}
             style={{ top, left}}>
            <p>{text}</p>
        </div>
    );
};

export default DataCircle;
