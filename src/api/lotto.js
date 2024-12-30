
import { AO } from "../lib/ao"
import { supply } from "../signals/alt"
let ao = new AO()


export async function fetchAltMinings([{pool_id,agent_id},{size,cursor}],{refetching}){
  console.log("fetchMinings",cursor)

  if(!pool_id||!agent_id) return null

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
              name:"Action",
              values: ["Save-Ticket"]
            },{
              name:"Mint",
              values: ["${agent_id}"]
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
    console.log("mintings",res)
    let minings
    if(res?.length > 0){
      minings = res.map(({node,cursor})=>{

        const tags = {}
        for (const {name,value} of node.tags) {
          tags[name] = value
        }
        
 
        return({
          id: node.id,
          address: tags?.Sender,
          amount: tags?.['Mint-Amount'],
          total : tags?.['Mint-Total'],
          tax : tags?.['Mint-Tax'],
          ticker: "ALT",
          denomination: "12",
          token: "",
          cursor,
          timestamp: node?.block?.timestamp
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


export async function fetchAltBuybacks([{buyback_id,agent_id},{size,cursor}],{refetching}){
  console.log("fetchAltBuybacks",buyback_id,agent_id)

  if(!buyback_id||!agent_id) return null

  try {
    const query_str =  `
      query{
        transactions(
          recipients: ["${agent_id}"],
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
              values: ["${buyback_id}"]
            },{
              name: "Action",
              values: ["Burn"]
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
    let buybacks
    if(res?.length > 0){
      buybacks = res.map(({node,cursor})=>{
        const tags = {}
        for (const {name,value} of node.tags) {
          tags[name] = value
        }
        return({
          id: node.id,
          quantity: tags?.Quantity,
          cost: tags?.Cost,
          timestamp: node.block.timestamp,
          cursor
        })
      })
    }
    // console.log(bets)
    return buybacks
  } catch (error) {
    console.error("fetch minings faild.", error)
    return null
  }
}

export async function fetchAltDividends([{pool_id,agent_id},{size,cursor}],{refetching}){
  console.log("fetchLottoDividends",agent_id)

  if(!pool_id||!agent_id) return null

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
              values: ["Distributed-Dividends"]
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
          addresses: tags?.Addresses,
          ref: tags?.['Distribution-No'],
          supply: tags?.Supply,
          timestamp: node?.block?.timestamp,
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


export const fetchTotalTokenHodlers = async(id,{refetching}) => {
  if(!id) {
    throw Error("missed id")
  }
  const { Messages } = await ao.dryrun({
    process: id,
    tags: {Action:"Balances"}
  })
  // console.log("fetchTotalTokenHodlers",Messages)
  if(Messages?.length>0&&Messages[0]){
    let count = 0
    const balances = JSON.parse(Messages[0]?.Data)
    for (const key in balances) {
      if(balances[key]>0){
        count++
      }
    }
    return count
  }
}

export const fetchTokenSupply = async(id,{refetching}) => {
  if(!id) {
    throw Error("missed id")
  }
  const { Messages } = await ao.dryrun({
    process: id,
    tags: {Action:"Total-Supply"}
  })
  if(Messages?.length>0&&Messages[0]){
    return JSON.parse(Messages[0]?.Data)
  }
}