export const executeQueryValues = (db, sql) => {
    try {
        return db.exec(sql)[0].values
    } catch (err) {
        return [];
    }
}
