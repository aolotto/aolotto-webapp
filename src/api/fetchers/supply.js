import { AO } from "../ao";
let ao = new AO()
export const fetchSupply = (pid,{refetching,value}) => {
   try {
    console.log("fetchSupply",pid)
      if (!pid) return;
      return ao.dryrun(pid,{Action: "Total-Supply"})
      .then(({ Messages }) => {
        console.log("fetchSupply",Messages)
        if (Messages?.[0]?.Data) {
          return Messages?.[0]?.Data
        }
      });
    } catch (error) {
      console.error(error)
      throw error;
    }
}