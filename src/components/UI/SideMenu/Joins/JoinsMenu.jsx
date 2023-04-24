import React from 'react';
import styles from './JoinsMenu.module.css';
import {MdDragHandle} from "react-icons/md";
import {JOIN_TYPES} from "../../../context/DbQueryConsts";

const JoinsMenu = () => {

    const dragStartHandler = (e, type) => { e.dataTransfer.setData("joinType", type) };

    return (
        <div className={styles.joinsMenu}>
            <label className={styles.joinLabel}>Join types:</label>
            <ul>
                {JOIN_TYPES.map((joinType, index) =>
                    <li
                        key={index} draggable={true}
                        onDragStart={(e) => dragStartHandler(e, joinType)}
                    >
                        <MdDragHandle/>
                        {joinType}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default JoinsMenu;
