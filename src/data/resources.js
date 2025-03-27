import { createResource, createRoot } from "solid-js";
import { AO } from "../api/ao";
import { storage } from "../lib/storage";

const ao = new AO();

export const [pool, { refetch: refetchPool, mutate: mutatePool }] = createRoot(() => createResource(
  () => import.meta.env.VITE_POOL_PROCESS || "default_pool",
  (pid, { refetching }) => {
    try {
      if (!pid) return;
      const key = `pool_${pid}`;
      let data = storage.get(key);
      if (data && !refetching) return data;
      return ao.dryrun({ process: pid, tags: { Action: "State" } })
        .then(({ Messages }) => {
          if (Messages?.[0]?.Data) {
            storage.set(key, JSON.parse(Messages?.[0]?.Data), { ttl: 60000, type: 'sessionStorage' });
            return JSON.parse(Messages?.[0]?.Data);
          }
        });
    } catch (error) {
      throw error;
    }
  }
));

