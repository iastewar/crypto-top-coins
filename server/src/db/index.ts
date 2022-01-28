import camelcase from "camelcase";
import { Pool, PoolClient } from "pg";
import { getAppLogger } from "../logging";

let dbPool: Pool;

export const getPool = () => {
  if (!dbPool) {
    dbPool = new Pool({
      connectionString: "", // TODO: replace with connection string
    });
  }

  return dbPool;
};

export const query = async (
  pool: Pool | PoolClient,
  text: string,
  params?: any
) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;

  getAppLogger().log(
    "debug",
    `executed query: ${text}, ${duration + "ms"}, ${res.rowCount} rows`
  );
  res.rows = convertRowsToCamelCase(res.rows);
  return res;
};

/**
 * Use this when you need to do multiple queries in one transaction.
 * Make sure to call release() when you are done with the client.
 */
export const getClient = (pool: Pool) => {
  return pool.connect();
};

const convertRowsToCamelCase = (rows: any[]) => {
  return rows.map((e) => {
    const res = {};
    for (const key of Object.keys(e)) {
      const newKey = camelcase(key);
      res[newKey] = e[key];
    }
    return res;
  });
};
