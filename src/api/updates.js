import { AO } from "../lib/ao"

let ao = new AO()


export const fetchUpdates = async(id,{refetch}) => {
  console.log("fetchUpdates",id)
  if(!id) {
    return
  }
  const { Messages } = await ao.dryrun({
    process: id,
    tags: {Action:"State"}
  })
  if(Messages?.length>0&&Messages[0]){
    return JSON.parse(Messages[0]?.Data)
  }
}
