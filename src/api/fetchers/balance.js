import { AO } from "../ao";
import { storage } from "../../lib/storage";
let ao = new AO()
export const fetchBalance = ({pid,address},{refetching,value}) => {
   try {
    if (!pid||!address) return;
    console.log("fetchBalance",pid,address)
    return ao.dryrun(pid,{Action: "Balance", Recipient:address})
      .then(({ Messages }) => {
        if (Messages?.[0]?.Data) {
          return Messages?.[0]?.Data
        }else{
          return 0
        }
      });
    } catch (error) {
      throw error;
    }
}