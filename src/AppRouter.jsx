import React from 'react';
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import SQLEditor from "./pages/SQLEditor";
import NotFound from "./pages/NotFound";

/**
 * AppRouter component defines the routing configuration using react-router-dom.
 * It sets up the routes for different pages of the application.
 *
 * @returns {JSX.Element} - The rendered AppRouter component.
 */
const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='tables' element={<Tables/>} />
            <Route path='editor' element={<SQLEditor/>} />
            <Route path='*' element={<NotFound/>} />
        </Routes>
    );
};

export default AppRouter;
