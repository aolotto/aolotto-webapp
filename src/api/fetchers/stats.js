import { AO } from "../ao";
import { storage } from "../../lib/storage";
let ao = new AO()

/**
 * Fetches statistics based on the provided `pid`.
 *
 * @param {string} pid - The unique identifier for the agent.
 * @param {Object} options - Additional options for fetching stats.
 * @param {boolean} options.refetching - If true, forces a refetch of the data even if cached data exists.
 * @param {*} options.value - Additional value parameter (not used in the current implementation).
 * @returns {Promise<Object|null>|Object|null} - Returns the fetched stats object, either from cache or from the API. 
 * If no data is available, returns `null`.
 * @throws {Error} - Throws an error if an exception occurs during the fetch process.
 *
 * @example
 * fetchStats('12345', { refetching: false })
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 */
export const fetchStats = (pid, { refetching, value }) => {
  try {
    console.log("fetchStats", pid)
    if (!pid) return;
    const key = `agent_stats_${pid}`;
    let data = storage.get(key);
    if (data && !refetching) return data;
    return ao.dryrun(pid, { Action: "Stats" })
      .then(({ Messages }) => {
        if (Messages?.[0]?.Data) {
          const newData = JSON.parse(Messages?.[0]?.Data)
          storage.set(key, newData, { ttl: 60000, type: 'sessionStorage' });
          return newData
        } else {
          return null
        }
      });
  } catch (error) {
    console.error(error)
    throw error;
  }
}