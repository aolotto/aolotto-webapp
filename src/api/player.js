import ticker from "../components/ticker"
import { AO } from "../lib/ao"
let ao = new AO()

export async function fetchTokenBalance(params,{value,refetching}){
  const{player_id,token_id} = params
  if(!player_id || !token_id) return null
  let localData = localStorage?.getItem('AOLOTTO-TOKENBALANCE-'+token_id+player_id)
  if(!localData || refetching){
    return await ao.dryrun({
      process: token_id,
      tags: { Action: "Balance", Recipient: player_id }
    })
    .then(({ Messages }) => {
      if (Messages?.length >= 1&& Messages[0].Data) {
        const data = JSON.parse(Messages[0].Data)
        if(data){
          document.hasStorageAccess().then((hasAccess) => {
            if (hasAccess) {
              localStorage.setItem('AOLOTTO-TOKENBALANCE-'+token_id+player_id,JSON.stringify(data))
            }
          })
          return data
        }else{
          return null
        }
      }else{
        return null
      }
    })
    .catch(err => {
      console.error(err);
      toast.error("fetch token balance faild")
      if(refetching){
        return value
      }else{
        throw(err)
      }
    })
  }else{
    return JSON.parse(localData)
  }
}


export async function fetchPlayerAccount({player,id},{refetching}){
  try {
    if(!player||!id) return
    console.log("fetchPlayerAccount",player,id)
    let key ='AOLOTTO-ACCOUNT-'+id+player
    let localData = localStorage?.getItem(key)
    if(!localData || refetching){
      return await ao.dryrun({
        process: id,
        tags: { Action: "Get-Player", Player: player }
      })
      .then(({ Messages,Errors }) => {
        console.log("fetchPlayerAccount-Result",Messages,Errors)
        if (Messages?.length >= 1&& Messages[0].Data) {
          const data = JSON.parse(Messages[0].Data)
          if(data){
            document.hasStorageAccess().then((hasAccess) => {
              if (hasAccess) {
                localStorage.setItem(key,JSON.stringify(data))
              }
            })

            
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
      return JSON.parse(localData)
    }
  } catch (error) {
    console.log(error)
    return null
  }
}


export async function fetchUserTokenBalances({player_id,token_ids},{refetching}){
  if(!player_id||!token_ids||token_ids?.length<=0) {
    throw Error("missed player id or token ids")
    return
  }
  return Promise.all(token_ids.map((token_id)=>new Promise((resolve, reject) => {
    if(!token_id||typeof(token_id)!="string"){
      reject("Invalid token ID")
    }
    let key = "tk_bal_"+token_id+"_"+player_id
    let cached = localStorage?.getItem(key)
    if(cached && !refetching){
      resolve([token_id,JSON.parse(cached)])
    }else{
      ao.dryrun({
        process: token_id,
        tags: { Action: "Balance", Recipient: player_id }
      })
      .then(({Messages,...rest})=>{
        console.log(rest)
        if (Messages?.length >= 1 && Messages[0].Data) {
          const data = JSON.parse(Messages[0].Data)
          if(data){
            document.hasStorageAccess().then((hasAccess) => {
              if (hasAccess) {
                localStorage.setItem(key,JSON.stringify(data))
              }
            })
            resolve([token_id,data])
          }else{
            resolve([token_id,"0"])
          }
        }else{
          reject("fetch balance error")
        }
      })
    }
  })))
  .then((bals)=>{
    const result = {}
    bals.forEach(([id,balance])=>result[id]=balance)
    return result
  })
}


export async function fetchPlayerTickets([{player_id,pool_id},{size,cursor}],{refetching}){
  console.log("fetchPlayerTickets",player_id,pool_id)

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
          round: tags.Round,
          x_numbers: tags['X-Numbers'],
          price : tags.Price,
          timestamp : node?.block?.timestamp,
          created : tags['Created'],
          round : tags['Round'],
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
              name: "Action",
              values: ["Save-Ticket"]
            },{
              name: "From-Process",
              values: ["${agent_id}"]
            },{
              name: "Sender",
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
        const mint = tags?.["X-Mint"]?.split(",")
 
        return({
          id: node.id,
          total: tags?.['Mint-Total'],
          buff: tags?.['Mint-Buff'],
          speed : tags?.['Mint-Speed'],
          amount: tags?.['Mint-Amount'],
          minter: tags?.Sender,
          timestamp : node?.block?.timestamp,
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
              values: ["Distribution"]
            },{
              name: "From-Process",
              values: ["${token_id}"]
            },{
              name: "Sender",
              values: ["${agent_id}"]
            },{
              name: "X-Distribution-From",
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
    console.log(query_str)
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
          distribute_from: tags?.['X-Distribution-From'],
          amount: tags?.['X-Amount'],
          distribute_unit: tags?.['X-Unit-Share'],
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