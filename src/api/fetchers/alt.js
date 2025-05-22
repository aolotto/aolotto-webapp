import { AO } from "../ao";
import { storage } from "../../lib/storage";
import { action } from "@solidjs/router";
let ao = new AO()


export async function fetchAltMintings([{pool_id,agent_id},{size,cursor}],{refetching}){
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
              values: ["Save-Ticket","Minting-Plused"]
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
          address: tags?.Sender || tags?.["Mint-For"],
          amount: tags?.['Mint-Amount'],
          total : tags?.['Mint-Total'],
          tax : Number(tags?.['Mint-Total']||0) - Number(tags?.['Mint-Amount']||0),
          ticker: "ALT",
          denomination: "12",
          token: "",
          cursor,
          timestamp: node?.block?.timestamp,
          action: tags?.Action,
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


export async function fetchAltBurnings([{agent_id},{size,cursor}],{refetching}){
  console.log("fetchAltBuybacks",agent_id)

  if(!agent_id) return null

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
    let burnings
    if(res?.length > 0){
      burnings = res.map(({node,cursor})=>{
        const tags = {}
        for (const {name,value} of node.tags) {
          tags[name] = value
        }
        return({
          id: node.id,
          quantity: tags?.Quantity,
          address: tags?.From || tags?.["From-Process"],
          timestamp: node.block.timestamp,
          cursor
        })
      })
    }
    // console.log(bets)
    return burnings
  } catch (error) {
    console.error("fetch minings faild.", error)
    return null
  }
}


export async function fetchAltStakings([{stake_id,agent_id},{size,cursor}],{refetching}){
  console.log("fetchAltStakings",stake_id,agent_id)

  if(!stake_id||!agent_id) return null

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
              values: ["${stake_id}"]
            },{
              name: "Asset-Id",
              values: ["${agent_id}"]
            },{
              name: "Action",
              values: ["Stake-Notice"]
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
    console.log('stakings: ', res);
    let stakings
    if(res?.length > 0){
      stakings = res.map(({node,cursor})=>{
        const tags = {}
        for (const {name,value} of node.tags) {
          tags[name] = value
        }
        return({
          id: node.id,
          quantity: tags?.Quantity,
          address: tags?.Staker,
          duration: tags?.["Locked-Time"],
          timestamp: node.block.timestamp,
          cursor
        })
      })
    }
    return stakings
  } catch (error) {
    console.error("fetch minings faild.", error)
    return null
  }
}



export async function fetchAltUnStakings([{stake_id,agent_id},{size,cursor}],{refetching}){
  console.log("fetchAltUnStakings",stake_id,agent_id)

  if(!stake_id||!agent_id) return null

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
              name: "X-Transfer-Type",
              values: ["Unstaked"]
            },{
              name: "Action",
              values: ["Transfer"]
            },{
              name: "From-Process",
              values: ["${stake_id}"]
            },]
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
    console.log('unstakes: ', res);
    let unstakes
    if(res?.length > 0){
      unstakes = res.map(({node,cursor})=>{
        const tags = {}
        for (const {name,value} of node.tags) {
          tags[name] = value
        }
        return({
          id: node.id,
          quantity: tags?.Quantity,
          address: tags?.['X-Staker'],
          amount: tags?.['X-Unstake-Amount'],
          timestamp: node?.block?.timestamp,
          cursor
        })
      })
    }
    // console.log(bets)
    return unstakes
  } catch (error) {
    console.error("fetch minings faild.", error)
    return null
  }
}
