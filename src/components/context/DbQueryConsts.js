export const GET_ALL_TABLES_DATA_QRY = "SELECT m.name AS table_name, COUNT(p.name) AS attribute_count, GROUP_CONCAT(p.name, ',') AS column_names, GROUP_CONCAT(p.type, ',') AS data_types\nFROM pragma_table_info(m.name) p JOIN (SELECT name FROM sqlite_master WHERE type='table') m WHERE m.name NOT IN ('sqlite_sequence', 'schema_migrations', 'ar_internal_metadata') GROUP BY table_name ORDER BY table_name;"

export const ALL_TABLES_QRY = "SELECT name FROM sqlite_master WHERE type='table'";

export const SELECT_TABLES_QRY = "SELECT name AS table_name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%';";

export const SELECT_FRN_KEYS_QRY = "SELECT m1.tbl_name AS from_table, m2.tbl_name AS to_table FROM sqlite_master m1 JOIN pragma_foreign_key_list(m1.tbl_name) fk JOIN sqlite_master m2 ON m2.tbl_name = fk.'table' WHERE m1.type = 'table' AND m2.type = 'table';";
