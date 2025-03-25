import { AO } from "../lib/ao"
let ao = new AO()
import { storage } from "../lib/storage"



export async function fetchPlayerAccount({player,id},{refetching}){
  try {
    if(!player||!id) return
    console.log("⏳ fetch [ player ] from : " + id + " with address " + player)
    let key ='aolotto-player-'+id+"-"+player
    let localData = storage.get(key,"sessionStorage")
    if(!localData || refetching){
      return await ao.dryrun({
        process: id,
        tags: { Action: "Get-Player", Player: player }
      })
      .then(({ Messages,Errors }) => {
        console.log("fetchPlayerAccount-Result",Messages,Errors)
        if (Messages?.length >= 1&& Messages?.[0]?.Data) {
          const data = JSON.parse(Messages?.[0]?.Data)
          if(data){
            storage.set(key,data,{type:"sessionStorage",ttl : 120000})
            return data
          }else{
            return null
          }
        }
        if(Errors){
          throw Error(Errors)
        }
      })
      .catch(err => {
        throw Error(err)
      })
    }else{
      return localData
    }
  } catch (error) {
    console.log(error)
    return null
  }
}


export async function fetchStaker({staker,pid},{value,refetching}){
  
  try {
    if(!staker||!pid) return
    console.log("⏳ fetch [staker] from : " + pid + " for : "+staker,refetching)
    let key ='aolotto-staker-'+pid+"-"+staker
    let session = storage.get(key,"sessionStorage")
    let result
    if(!session || refetching){
      const { Messages } = await ao.dryrun({
        process: pid,
        tags: { Action: "Get", Tab: "Stakers", Address: staker }
      })
      console.log(Messages)
      if (Messages && Messages?.[0]){
        storage.set(key,JSON.parse(Messages?.[0]?.Data),{type:"sessionStorage",ttl : 120000})
        result = JSON.parse(Messages?.[0]?.Data)
      }else{
        result = null
      }
    }else{
      result = session
    }
    console.log("✅ [staker] fetched",result)
    return result
  } catch (error) {
    console.log(" ❌ [staker] fetch fail")
    throw error
  }
}



export async function fetchPlayerTickets([{player_id,pool_id},{size,cursor}],{refetching}){
  console.log("fetchPlayerTickets",player_id,pool_id)

  if(!player_id||!pool_id) return null

  try {
    const query_str =  `
      query{
        transactions(
          recipients: ["${player_id}"],
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
              values: ["Lotto-Ticket"]
            },{
              name: "From-Process",
              values: ["${pool_id}"]
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
    let bets
    if(res?.length > 0){
      bets = res.map(({node,cursor})=>{

        const tags = {}
        for (const {name,value} of node.tags) {
          tags[name] = value
        }
        const mint = tags?.["X-Mint"]?.split(",")
 
        return({
          id: node.id,
          ticket: tags?.['Pushed-For'],
          token: tags?.Token,
          ticker: tags?.Ticker,
          denomination: tags?.Denomination,
          count: tags?.Count&&Number(tags?.Count),
          amount: tags?.Amount,
          round: tags?.Round,
          x_numbers: tags?.['X-Numbers'],
          price : tags?.Price,
          timestamp : node?.block?.timestamp,
          created : tags?.['Created'],
          round : tags?.['Round'],
          mint,
          cursor
        })
      })
    }
    // console.log(bets)
    return bets
  } catch (error) {
    console.error("fetch user bets faild.", error)
    return null
  }
}


export async function fetchPlayerMintings([{player_id,pool_id,agent_id},{size,cursor}],{refetching}){
  console.log("fetchPlayerMintings",player_id,pool_id)

  if(!player_id||!pool_id||!agent_id) return null

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
              name: "Mint-For",
              values: ["${player_id}"]
            },{
              name: "Mint",
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
    let mints
    if(res?.length > 0){
      mints = res.map(({node,cursor})=>{

        const tags = {}
        for (const {name,value} of node.tags) {
          tags[name] = value
        }
    
 
        return({
          id: node.id,
          type: tags?.Action,
          total: tags?.['Mint-Total'],
          buff: tags?.['Mint-Buff'],
          speed : tags?.['Mint-Speed'],
          amount: tags?.['Mint-Amount'],
          minter: tags?.Sender,
          timestamp : node?.block?.timestamp,
          mint_tine : tags?.['Mint-Time'],
          bet_id : tags?.['Bet-Id'],
          cursor
        })
      })
    }
    // console.log(mints)
    return mints
  } catch (error) {
    console.error("fetch user mintings faild.", error)
    return null
  }
}



export async function fetchPlayerRewards([{player_id,agent_id},{size,cursor}],{refetching}){
  console.log("fetchPlayerRewards",player_id)

  if(!player_id||!agent_id) return null

  try {
    const query_str =  `
      query{
        transactions(
          recipients: ["${player_id}"],
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
              values: ["Win-Notice"]
            },{
              name: "From-Process",
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
    // console.log(query_str)
    const res = await ao.query(query_str)
    // console.log("res",res)
    let rewards
    if(res?.length > 0){
      rewards = res.map(({node,cursor})=>{
        const tags = {}
        for (const {name,value} of node.tags) {
          tags[name] = value
        }
        return({
          id: node.id,
          prize: tags?.Prize,
          tax: tags?.Tax,
          token: tags?.Token,
          ticker: tags?.Ticker,
          denomination: tags?.Denomination,
          jackpot: tags?.Jackpot,
          tax_rate: tags?.['Tax-Rate'],
          round: tags.Round,
          lucky_numbers: tags?.['Lucky-Number'],
          reward_type : tags?.['Reward-Type'],
          timestamp : node?.block?.timestamp,
          created : tags['Created'],
          cursor
        })
      })
    }
    // console.log(bets)
    return rewards
  } catch (error) {
    console.error("fetch user rewards faild.", error)
    return null
  }
}



export async function fetchPlayerDividends([{player_id,pool_id,token_id,agent_id},{size,cursor}],{refetching}){
  console.log("fetchPlayerDividends",player_id)

  if(!player_id) return null

  try {
    const query_str =  `
      query{
        transactions(
          recipients: ["${player_id}"],
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
              values: ["Distributed"]
            },{
              name: "From-Process",
              values: ["${token_id}"]
            },{
              name: "Sender",
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
    // console.log(query_str)
    const res = await ao.query(query_str)
    console.log("res",res)
    let rewards
    if(res?.length > 0){
      rewards = res.map(({node,cursor})=>{
        const tags = {}
        for (const {name,value} of node.tags) {
          tags[name] = value
        }
        return({
          id: node.id,
          distribute_id: tags?.['X-Distribution-Id'],
          distribute_from: tags?.Sender,
          amount: tags?.Quantity,
          distribute_unit: 0,
          timestamp : node?.block?.timestamp,
          token: tags?.['From-Process'],
          quantity: tags?.Quantity,
          cursor
        })
      })
    }
    // console.log(bets)
    return rewards
  } catch (error) {
    console.error("fetch user rewards faild.", error)
    return null
  }
}


export async function fetchPlayerCliams([{player_id,token_id,agent_id},{size,cursor}],{refetching}){
  console.log("fetchPlayerDividends",player_id)

  if(!player_id) return null

  try {
    const query_str =  `
      query{
        transactions(
          recipients: ["${player_id}"],
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
              values: ["Claim-Notice"]
            },{
              name: "From-Process",
              values: ["${token_id}"]
            },{
              name: "Sender",
              values: ["${agent_id}"]
            },{
              name: "Action",
              values: ["Credit-Notice"]
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
    // console.log("res",res)
    let claims
    if(res?.length > 0){
      claims = res.map(({node,cursor})=>{
        const tags = {}
        for (const {name,value} of node.tags) {
          tags[name] = value
        }
        return({
          id: node.id,
          quantity: tags?.Quantity,
          tax: tags?.['X-Tax'],
          amount: tags?.['X-Amount'],
          claim_id: tags?.['X-Claim-Id'],
          sender: tags?.Sender,
          pool: tags?.['X-Pool'],
          timestamp : node?.block?.timestamp,
          cursor
        })
      })
    }
    // console.log(bets)
    return claims
  } catch (error) {
    console.error("fetch user rewards faild.", error)
    return null
  }
}