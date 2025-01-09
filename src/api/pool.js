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

export const fetchGapRewardsByBet = async({pool_id,agent_id,bet_id},{refetch}) => {
  console.log("fetchGapRewards",pool_id,agent_id,bet_id)
  if(!pool_id||!agent_id||!bet_id) return null
  try {
    const query_str =  `
        query{
          transactions(
            sort: HEIGHT_DESC,
            first: 150,
            recipients: ["${pool_id}"],
            tags: [{
                name: "Data-Protocol",
                values: ["ao"]
              },{
                name: "Variant",
                values: ["ao.TN.1"]
              },{
                name: "Type", 
                values: ["Message"]
              },{
                name: "From-Process",
                values: ["${agent_id}"]
              },{
                name: "Action",
                values: ["Minting-Plused"]
              },{
                name: "Bet-Id",
                values: ["${bet_id}"]
              }]
          ) {
            edges {
              cursor
              node {
                id
                tags {
                  name,
                  value
                }
                block {
                  timestamp
                }
              }
            }
          }
        }
      `
      const res = await ao.query(query_str)
      let gaps
      if(res?.length > 0){
        gaps = res.map(({node,cursor})=>{
          const tags = {}
          for (const {name,value} of node.tags) {
            tags[name] = value
          }
          return({
            id: node.id,
            amount: tags?.['Mint-Amount'],
            total: tags?.['Mint-Total'],
            speed: tags?.['Mint-Speed'],
            time: tags?.['Mint-Time']?Number(tags?.['Mint-Time']):0,
          })
        })
      }

      console.log("gaps",gaps)
      gaps.sort((a, b) => b.time - a.time)
      return gaps

  } catch (error) {
    console.error("fetch minings faild.", error)
    return null
  }
    
  
      // const res = await ao.query(query_str)
      // let gaps
      // if(res?.length > 0){
      //   gaps = res.map(({node,cursor})=>{
      //     const tags = {}
      //     for (const {name,value} of node.tags) {
      //       tags[name] = value
      //     }
      //     return({
      //       id: node.id,
      //       amount: tags?.Amount,
      //       addresses: tags?.Addresses,
      //       ref: tags?.['Distribution-No'],
      //       supply: tags?.Supply,
      //       timestamp: node?.block?.timestamp,
      //       cursor
      //     })
      //   })
      // }
      
}
