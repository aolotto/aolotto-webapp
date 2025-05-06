import { AO } from "../ao";
import { storage } from "../../lib/storage";
let ao = new AO()

/**
 * Retrieves the state associated with the given `pid` (agent ID).
 * 
 * This function first checks for cached data in storage using a key
 * derived from the `pid`. If no valid cached data is found or if `refetching` is true,
 * it performs a dry run action to fetch the latest state data from the server.
 * The fetched data is then stored in session storage with a time-to-live (TTL) of 60 seconds.
 * 
 * @param {string} pid - The agent ID for which the state is to be retrieved.
 * @param {Object} options - Additional options for the fetch operation.
 * @param {boolean} options.refetching - Indicates whether to force fetching fresh data from the server.
 * @param {*} options.value - An optional value (not used in the current implementation).
 * 
 * @returns {Promise<Object|null>|Object|null} - Returns cached data if available and valid,
 * or a promise resolving to the fetched data. Returns `null` if no data is available.
 * 
 * @throws {Error} - Throws an error if an exception occurs during the fetch operation.
 */
export const fetchState = (pid, { refetching, value }) => {
  try {
    console.log("fetchState", pid)
    if (!pid) return;
    return ao.dryrun(pid, { Action: "State" })
      .then(({ Messages }) => {
        if (Messages?.[0]?.Data) {
          return JSON.parse(Messages?.[0]?.Data)
        }
      })
      .catch((error)=>{throw new Error(error)} );
  } catch (error) {
    throw new Error(error)
  }
}