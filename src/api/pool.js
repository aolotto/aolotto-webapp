import { AO } from "../lib/ao"
import { cache } from "../lib/cache"
import { pool } from "../signals/global"
let ao = new AO()
export const fetchPoolState = async(id,{refetch}) => {
  console.log('fetchPoolState',refetch)
  if(!id) {
    throw Error("missed id")
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
    throw Error("missed id")
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
    throw Error("missed id")
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
    throw Error("missed pool id or agent id")
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
  console.log("fetchActiveBets",id)
  if(!id) {
    throw Error("missed id")
  }
  const { Messages } = await ao.dryrun({
    process: id,
    tags: {Action:"Get",Table:"Bets",Limit:toString(size),Offset:cursor?toString(cursor):"1"}
  })
  if(Messages?.length>0&&Messages[0]){
    return JSON.parse(Messages[0]?.Data)
  }
}

