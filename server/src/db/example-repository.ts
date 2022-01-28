import { Pool, PoolClient } from 'pg';
import * as db from '.';

const tableName = 'test'

export interface Test {
    id: number;
    name: string;
}

export const getTest = async (
    pool: Pool | PoolClient,
    id: number
) => {
    const sql = `
        SELECT
        id,
        name
        FROM ${tableName}
        WHERE id = $1
    `;

    const { rows } = await db.query(pool, sql, [id]);
    return rows as Test[];
}
