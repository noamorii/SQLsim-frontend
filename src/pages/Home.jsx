import style from "./Home.module.css";
import {Fade, Slide} from 'react-awesome-reveal';

const Home = () => {
    return (
        <div className={style.homePage}>
            {/*<h1 className={style.mainLabel}>SQL simulator</h1>*/}
            <Fade duration={5000}>
                <header className={style.AppHeader}>
                    <h1>SQL Simulator</h1>
                    <p>Discover the power of SQL. Create, explore, combine and visualize your own queries!</p>
                </header>
            </Fade>

            <Slide>
                <section className={style.AppSection}>
                    <h2>Create Database Operations</h2>
                    <p>Begin your journey into SQL. Create tables, insert data, and more!</p>
                </section>
            </Slide>

            <Slide>
                <section className={style.AppSection}>
                    <h2>Explore Select Operations</h2>
                    <p>Dive into the heart of SQL with select operations. Learn how to query your data effectively and
                        efficiently.</p>
                </section>
            </Slide>

            <Slide>
                <section className={style.AppSection}>
                    <h2>Combine Tables</h2>
                    <p>Master the art of joining tables. Uncover the hidden relationships in your data.</p>
                </section>
            </Slide>

            <Slide>
                <section className={style.AppSection}>
                    <h2>Build and Visualize Your Query</h2>
                    <p>Bring your data to life. Build complex queries and see the results in real time.</p>
                </section>
            </Slide>

            <footer className={style.AppFooter}>
                <p>Start your SQL journey today!</p>
                <button>Get Started</button>
            </footer>
        </div>
    );
};

export default Home;
