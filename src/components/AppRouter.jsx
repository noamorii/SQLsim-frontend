import React from 'react';
import {Route, Routes} from "react-router-dom";
import Home from "../pages/Home";
import Tables from "../pages/Tables";
import SQLEditor from "../pages/SQLEditor";
import NotFound from "../pages/NotFound";

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
