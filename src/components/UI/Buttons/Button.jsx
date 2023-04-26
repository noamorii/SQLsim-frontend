import React from 'react';
import styles from "./Button.module.css";

/**
 * Button component creates a generic button with provided properties.
 *
 * @component
 * @param {Object} props - Properties passed to the Button component.
 * @param {string} props.text - Text to be displayed on the button.
 * @param {function} props.onClick - Function to be called when the button is clicked.
 * @param {string} [props.className] - CSS class name to be applied to the button.
 * @param {boolean} [props.disabled] - Flag to disable the button. Default is false.
 * @param {JSX.Element} [props.icon] - Icon component to be displayed alongside the text.
 * @returns {JSX.Element} The rendered Button component.
 */
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
