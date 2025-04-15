import { AO } from "../ao";
import { storage } from "../../lib/storage";
let ao = new AO()
export const fetchBalance = ({pid,address},{refetching,value}) => {
   try {
    console.log("fetchBalance",pid,address)
      if (!pid||!address) return;
      const key = `balance_${pid}_${address}`;
      let data = storage.get(key);
      if (data && !refetching) return data;
      return ao.dryrun(pid,{Action: "Balance", Recipient:address})
      .then(({ Messages }) => {
        if (Messages?.[0]?.Data) {
          const newData = Messages?.[0]?.Data
          storage.set(key, newData, { ttl: 60000, type: 'sessionStorage' });
          return newData
        }else{
          return null
        }
      });
    } catch (error) {
      console.error(error)
      throw error;
    }
}