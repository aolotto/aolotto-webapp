import { AO } from "../lib/ao"

let ao = new AO()
export const fetchPoolState = async(id,{refetch}) => {
  console.log("fetchPoolState",id)
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


export const fetchStats = async(id,{refetch}) => {
  console.log("fetchStats",id)
  if(!id) {
    return
  }
  const { Messages } = await ao.dryrun({
    process: id,
    tags: {Action:"Stats"}
  })
  if(Messages?.length>0&&Messages[0]){
    return JSON.parse(Messages[0]?.Data)
  }
}

export const fetchPoolRanks = async(id,{refetch}) => {
  console.log("fetchPoolRanks",id)
  if(!id) {
    return
  }
  const { Messages } = await ao.dryrun({
    process: id,
    tags: {Action:"Ranks"}
  })
  if(Messages?.length>0&&Messages[0]){
    return JSON.parse(Messages[0]?.Data)
  }
}



export const fetchActiveBets = async([id,{size,page}],{value,refetch})=>{
  try {
    if(!id) {
      return
    }
    const offset = page?size*page+1:1
    const { Messages } = await ao.dryrun({
      process: id,
      tags: {Action:"Get",Table:"Bets",Limit:toString(size),Offset:offset.toString()}
    })
    // console.log("fetchActiveBets",Messages)
    if(Messages?.length>0&&Messages?.[0]){
      return JSON.parse(Messages?.[0]?.Data)
    }
    
  } catch (error) {
    console.log(error)
  }
  
}



export const fetchGapRewards = async(id,{refetch}) => {
  console.log("fetchGapRewards",id)
  if(!id) {
    return
  }
  const { Messages } = await ao.dryrun({
    process: id,
    tags: {Action:"Gap-Rewards"}
  })
  if(Messages?.length>0&&Messages[0]){
    return JSON.parse(Messages[0]?.Data)
  }
}
