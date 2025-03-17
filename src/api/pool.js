import { AO } from "../lib/ao"

let ao = new AO()

export const fetchPoolState = async(id,{refetch}) => {
  console.log("⏳ fetch [pool state] from :" + id)
  if(!id) {
    return
  }
  const { Messages } = await ao.dryrun({
    process: id,
    tags: {Action:"State"}
  })
  if(Messages?.length>0&&Messages[0]){
    console.log(" ✅ [pool state] ")
    return JSON.parse(Messages[0]?.Data)
  }
}


export const fetchStats = async(id,{refetch}) => {
  if(!id) {
    return
  }
  console.log("⏳ fetch [stats] from :" + id)
  const { Messages } = await ao.dryrun({
    process: id,
    tags: {Action:"Stats"}
  })
  if(Messages?.length>0&&Messages[0]){
    console.log(" ✅ [stats] ")
    return JSON.parse(Messages[0]?.Data)
  }
}

export const fetchPoolRanks = async(id,{value,refetching}) => {
  if(!id) {
    return
  }
  console.log("⏳ fetch [ranks] from :" + id)
  const key = "RANKS_"+id
  const session = sessionStorage.getItem(key)&&JSON.parse(sessionStorage.getItem(key))
  let ranks
  if(!session || refetching){
    const { Messages } = await ao.dryrun({
      process: id,
      tags: {Action:"Ranks"}
    })
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



export const fetchActiveBets = async([id,{size,page}],{value,refetching})=>{
  try {
    if(!id) {
      return
    }
    console.log("⏳ fetch [active bets] from :" + id, value, refetching)
    const offset = page?size*page+1:1
    const {Messages} = await ao.dryrun({
      process: id,
      tags: {Action:"Get",Table:"Bets",Limit:size.toString(),Offset:offset.toString()}
    })
    
    if(Messages?.length>0&&Messages?.[0]){
      console.log(" ✅ [active bets] ")
      console.log(JSON.parse(Messages?.[0]?.Data))
      return JSON.parse(Messages?.[0]?.Data)
    }else{
      return null
    }
    
  } catch (error) {
    console.error("渲染投注列表失败")
    throw error
  }
  
}



export const fetchGapRewards = async(id,{refetch}) => {
  if(!id) {
    return
  }
  console.log("⏳ fetch [gap rewards] from :" + id)
  const { Messages } = await ao.dryrun({
    process: id,
    tags: {Action:"Gap-Rewards"}
  })
  if(Messages?.length>0&&Messages[0]){
    return JSON.parse(Messages[0]?.Data)
  }
}
