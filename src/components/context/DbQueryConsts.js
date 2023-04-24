export const GET_ALL_TABLES_DATA_QRY = "SELECT m.name AS table_name, COUNT(p.name) AS attribute_count, GROUP_CONCAT(p.name, ',') AS column_names, GROUP_CONCAT(p.type, ',') AS data_types FROM pragma_table_info(m.name) p JOIN (SELECT name FROM sqlite_master WHERE type='table') m WHERE m.name NOT IN ('sqlite_sequence', 'schema_migrations', 'ar_internal_metadata') GROUP BY table_name ORDER BY table_name;"

export const ALL_TABLES_QRY = "SELECT name FROM sqlite_master WHERE type='table'";

export const SELECT_TABLES_QRY = "SELECT name AS table_name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%';";

export const SELECT_FRN_KEYS_QRY = "SELECT m.name AS table_from, f1.'from' AS attribute, f1.'table' AS table_to, f1.'to' AS attribute FROM sqlite_master AS m JOIN pragma_foreign_key_list(m.name) AS f1 WHERE m.type = 'table';";

export const JOIN_TYPES = ["NATURAL JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"];
