import { AO } from "../ao";
let ao = new AO()

export const fetchActiveBets = async([id,{size,page}],{value,refetching})=>{
  try {
    if(!id) {
      return
    }
    console.log("⏳ fetch [active bets] from :" + id, value, refetching)
    const offset = page?size*page+1:1
    return ao.dryrun(id,{Action: "Get", Table:"Bets", Limit:size.toString(),Offset:offset.toString()})
    .then(({ Messages }) => {
      if (Messages?.[0]?.Data) {
        return JSON.parse(Messages?.[0]?.Data)
      }else{
        return null
      }
    });    
  } catch (error) {
    throw error
  }
}