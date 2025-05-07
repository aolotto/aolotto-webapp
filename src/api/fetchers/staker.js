import { AO } from "../ao";
let ao = new AO()

export async function fetchStaker({staker,pid}){
  console.log("fetchStaker",pid,staker)
  if(!staker||!pid) return
  try {
    
    return await ao.dryrun(pid,{ Action: "Get", Tab: "Stakers", Address: staker })
      .then(({ Messages,Errors }) => {
        if (Messages?.length >= 1&& Messages?.[0]?.Data) {
          const data = JSON.parse(Messages?.[0]?.Data)
          if(data){
            return data
          }else{
            return null
          }
        }
        if(Errors){
          throw new Error(Errors)
        }
      })
    
  } catch (error) {
    throw error
  }
}