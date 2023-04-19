import React from 'react';
import styles from "./Button.module.css";

const Button = ({text, onClick, className, disabled, icon}) => {
    return (
        <div className={styles.btn} onClick={onClick}>
            <button className={className} onClick={onClick} disabled={disabled}>
                {text}
            </button>
            {icon}
        </div>
    );
};

export default Button;
