import { AO } from "../ao";
import { storage } from "../../lib/storage";
let ao = new AO()
export const fetchRanks = async(id,{value,refetching}) => {
  if(!id) {
    return
  }
  console.log("⏳ fetch [ranks] from :" + id)
  const key = "ranks_"+id
  const session = sessionStorage.getItem(key)&&JSON.parse(sessionStorage.getItem(key))
  let ranks
  if(!session || refetching){
    const { Messages } = await ao.dryrun(id,{Action:"Ranks"})
    if(Messages?.length>0&&Messages[0]){
      console.log(" ✅ [ranks] ")
      sessionStorage.setItem(key,Messages[0]?.Data)
      ranks = JSON.parse(Messages[0]?.Data)
    }
  }else{
    ranks = session
  }
  return ranks
}

