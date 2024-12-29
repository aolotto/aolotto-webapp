import { AO } from "../lib/ao"

let ao = new AO()
export const fetchPoolState = async(id,{refetch}) => {
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

export const fetchPoolMine = async({pool_id,agent_id},{refetch}) => {
  if(!pool_id||!agent_id) {
    return
  }
  const { Messages } = await ao.dryrun({
    process: agent_id,
    tags: {Action:"Mining-Quota",Pool:pool_id}
  })
  if(Messages?.length>0&&Messages[0]){
    return JSON.parse(Messages[0]?.Data)
  }
}


export const fetchActiveBets = async([id,{size,cursor}],{value,refetch})=>{
  try {
    if(!id) {
      return
    }
    console.log("fetchActiveBets",id)
    const { Messages } = await ao.dryrun({
      process: id,
      tags: {Action:"Get",Table:"Bets",Limit:toString(size),Offset:cursor?toString(cursor):"1"}
    })
    // console.log("fetchActiveBets",Messages)
    if(Messages?.length>0&&Messages[0]){
      return JSON.parse(Messages[0]?.Data)
    }
    
  } catch (error) {
    console.log(error)
  }
  
}

