import { AO } from "../ao";
import { storage } from "../../lib/storage";
let ao = new AO()
export const fetchAgentStats = (pid,{refetching,value}) => {
   try {
    console.log("fetchAgentStats",pid)
      if (!pid) return;
      const key = `agent_stats_${pid}`;
      let data = storage.get(key);
      if (data && !refetching) return data;
      return ao.dryrun(pid,{Action: "Stats"})
      .then(({ Messages }) => {
        if (Messages?.[0]?.Data) {
          storage.set(key, JSON.parse(Messages?.[0]?.Data), { ttl: 60000, type: 'sessionStorage' });
          return JSON.parse(Messages?.[0]?.Data);
        }
      });
    } catch (error) {
      console.error(error)
      throw error;
    }
}