import React, {useLayoutEffect, useRef, useState} from 'react';
import style from "./DataCircle.module.css"

const DataCircle = ({ text }) => {
    const circleRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useLayoutEffect(() => {
        const container = document.getElementById("circle-container");
        const circleRect = circleRef.current.getBoundingClientRect();
        const newTop = Math.random() * (container.offsetHeight - circleRect.height);
        const newLeft = Math.random() * (container.offsetWidth - circleRect.width);
        setPosition({ top: newTop, left: newLeft });
    }, []);

    return (
        <div ref={circleRef} id={`circle-${text}`}
             className={style.circle} style={{ ...position}}>
            <p>{text}</p>
        </div>
    );
};

export default DataCircle;
