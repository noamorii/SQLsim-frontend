import React, {useEffect, useRef, useState} from 'react';
import style from './DataCircle.module.css';

const DataCircle = ({ text }) => {
    const circleRef = useRef(null);
    const {offsetHeight, offsetWidth} = document.getElementById('circleContainer');
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const checkCollisions = (circle) => {
        const circles = document.querySelectorAll('[id^="circle-"]');

        circles.forEach((otherCircle) => {
            if (circle !== otherCircle) {
                const otherCirclePosition = otherCircle.getBoundingClientRect();
                console.log(circle.left, circle.top);
                const dx = Math.abs(circle.left - otherCirclePosition.left);
                const dy = Math.abs(circle.top - otherCirclePosition.top);
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = circle.offsetWidth / 2 + otherCircle.offsetWidth / 2 + 30;

                if (distance < minDistance) {
                    return true;
                }
            }
        });
        return false
    };

    const getNewPosition = (offset, dimension) => {
        return Math.random() * (offset - dimension);
    }

    useEffect(() => {
        const circle = circleRef.current.getBoundingClientRect();

        let newTop = getNewPosition(offsetHeight, circle.height);
        let newLeft = getNewPosition(offsetWidth, circle.width);

        while (checkCollisions(circle)) {
            newTop = getNewPosition(offsetHeight, circle.height);
            newLeft = getNewPosition(offsetWidth, circle.width);
        }

        setPosition({ top: newTop, left: newLeft });
    }, []);

    return (
        <div ref={circleRef} id={`circle-${text}`} className={style.circle} style={{...position }}>
            <p>{text}</p>
        </div>
    );
};

export default DataCircle;

