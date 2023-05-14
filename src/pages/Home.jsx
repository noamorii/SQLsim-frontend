import style from "./Home.module.css";
import {Fade, Slide} from 'react-awesome-reveal';
import from from '../images/from.svg';
import visualization from '../images/visualization.svg';
import diagram from '../images/diagram.svg';
import {useNavigate} from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/tables');
    }

    return (
        <div className={style.homePage}>
            <Fade duration={3000}>
                <header className={style.homeHeader}>
                    <h1><span className={style.sqlHeader}>SQL</span> Simulator</h1>
                    <p>Discover the power of SQL</p>
                    <p>Create, explore, combine and visualize your own queries!</p>
                </header>
            </Fade>

            <Slide direction={"right"} duration={2000}>
                <section className={style.homeSectionRight}>
                    <h2>Visualize Your Tables</h2>
                    <p>Upload your own database and visualize all tables and their attributes</p>
                    <p>Play with interactive visualization and explore your relation database</p>
                    <object data={diagram} type="image/svg+xml" style={{width: "800px"}}/>
                </section>
            </Slide>

            <Slide direction={"left"}>
                <section className={style.homeSectionLeft}>
                    <h2>Explore SELECT Operations</h2>
                    <p>Dive into the heart of SQL with select operations</p>
                    <p>Master data exploration and precise querying with our interactive playground</p>
                    <object data={from} type="image/svg+xml" style={{width: "600px"}}/>
                </section>
            </Slide>

            <Slide direction={"right"}>
                <section className={style.homeSectionRight}>
                    <h2>Visualize Your Queries</h2>
                    <p>Experience the power of data at your fingertips</p>
                    <p>Construct queries, visualize results, and delve into your data</p>
                    <object data={visualization} type="image/svg+xml" style={{width: "600px"}}/>
                </section>
            </Slide>

            <Slide direction={"left"}>
                <section className={style.homeSectionLeft}>
                    <h2>Start your SQL journey now!</h2>
                    <button onClick={handleClick} className={style.homeButton} role="button">Get Started</button>
                </section>
            </Slide>
        </div>
    );
};

export default Home;
