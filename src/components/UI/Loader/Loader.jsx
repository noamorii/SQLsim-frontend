import React from 'react';
import style from './Loader.module.css'

/**
 * Loader component displays a simple loading animation.
 *
 * @component
 * @returns {JSX.Element} The rendered Loader component.
 */
const Loader = () => {
    return (
        <div className={style.loaderContainer}>
            <div className={style.loader}/>
        </div>
    );
};

export default Loader;
