import React from "react";

export const executeQueryValues = (db, sql) => {
    try {
        return db.exec(sql)[0].values;
    } catch (err) {
        return [];
    }
}

export const executeQuery = (db, sql) => {
    try {
        return db.exec(sql)[0];
    } catch (err) {
        return {columns: [], values: []};
    }
}

