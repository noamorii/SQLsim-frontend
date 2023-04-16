import React from 'react';
import styles from './JoinsMenu.module.css';

const JOIN_TYPES = ["Natural Join", "Inner Join", "Left Join", "Right Join", "Full outer Join"];
const JoinsMenu = () => {

    const dragStartHandler = (e, type) => { e.dataTransfer.setData("joinType", type) };

    return (
        <div className={styles.joinsMenu}>
            <p>Joins:</p>
            <ul>
                {JOIN_TYPES.map((joinType, index) =>
                    <li
                        key={index} draggable={true}
                        onDragStart={(e) => dragStartHandler(e, joinType)}
                    >
                        {joinType}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default JoinsMenu;
