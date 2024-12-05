
import { AO } from "../lib/ao"
let ao = new AO()


export async function fetchLottoMinings([{pool_id,agent_id},{size,cursor}],{refetching}){
  console.log("fetchLottoMinings",cursor)

  if(!pool_id||!pool_id) return null

  try {
    const query_str =  `
      query{
        transactions(
          recipients: ["${pool_id}"],
          first: ${size||100},
          after: "${cursor?cursor:''}",
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
              name: "X-Mined",
              values: []
            },{
              name:"Action",
              values: ["Save-Lotto"]
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
    console.log(query_str)
    const res = await ao.query(query_str)
    // console.log(res)
    let minings
    if(res?.length > 0){
      minings = res.map(({node,cursor})=>{

        const tags = {}
        for (const {name,value} of node.tags) {
          tags[name] = value
        }
        const mined = tags["X-Mined"]?.split(",")
 
        return({
          id: node.id,
          address: tags?.Sender,
          mined,
          amount: mined?.[0],
          ticker: mined?.[1],
          denomination: mined?.[2],
          token: mined?.[3],
          cursor,
          timestamp: node.block.timestamp
        })
      })
    }
    // console.log(bets)
    return minings
  } catch (error) {
    console.error("fetch minings faild.", error)
    return null
  }
}


export async function fetchLottoDividends([{pool_id,agent_id,token_id},{size,cursor}],{refetching}){
  console.log("fetchLottoDividends",agent_id)

  if(!pool_id||!agent_id||!token_id) return null

  try {
    const query_str =  `
      query{
        transactions(
          recipients: ["${pool_id}"],
          first: ${size||100},
          after: "${cursor?cursor:''}",
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
              values: ["Distributed"]
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
    console.log(query_str)
    const res = await ao.query(query_str)
    console.log(res)
    let dividends
    if(res?.length > 0){
      dividends = res.map(({node,cursor})=>{

        const tags = {}
        for (const {name,value} of node.tags) {
          tags[name] = value
        }
 
        return({
          id: node.id,
          amount: tags?.Amount,
          count: tags?.Count,
          ref: tags?.['Distribution-Ref'],
          denomination: tags?.Denomination,
          token: tags?.Token,
          ticker: tags?.Ticker,
          cursor
        })
      })
    }
    // console.log(bets)
    return dividends
  } catch (error) {
    console.error("fetch minings faild.", error)
    return null
  }
}
