import { AO } from "../ao";
let ao = new AO()


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


export async function fetchPlayerMintings([{player_id,pool_id,agent_id,alt_id},{size,cursor}],{refetching}){
  console.log("fetchPlayerMintings",player_id,alt_id)

  if(!player_id||!alt_id) return null

  try {
    const query_str =  `
      query{
        transactions(
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
              values: ["${alt_id}"]
            },{
              name: "Mint-For",
              values: ["${player_id}"]
            },{
              name: "Action",
              values: ["Minted"]
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
          type: tags?.["Mint-Type"] || tags?.Action,
          total: tags?.['Mint-Total'],
          buff: tags?.['Mint-Buff'],
          speed : tags?.['Mint-Speed'],
          amount: tags?.['Mint-Amount'],
          minter: tags?.Sender,
          timestamp : node?.block?.timestamp,
          mint_time : tags?.['Mint-Time'],
          bet_id : tags?.['Bet-Id'],
          cursor
        })
      })
    }
    console.log(mints)
    return mints
  } catch (error) {
    console.error("fetch user mintings faild.", error)
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


export async function fetchPlayerCliams([{player_id,token_id,agent_id,alt_id},{size,cursor}],{refetching}){
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
              values: ["Claim-Notice","Distributed"]
            },{
              name: "From-Process",
              values: ["${token_id}"]
            },{
              name: "Sender",
              values: ["${agent_id}","${alt_id}"]
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
          type : tags?.["X-Transfer-Type"],
          timestamp : node?.block?.timestamp,
          cursor
        })
      })
    }
    console.log(claims)
    return claims
  } catch (error) {
    console.error("fetch user rewards faild.", error)
    return null
  }
}


export async function fetchPlayerStakings([{player_id,stake_id,agent_id,alt_id},{size,cursor}]){
  console.log("fetchPlayerStakings",player_id,stake_id,agent_id)
  if(!player_id||!stake_id||!agent_id) return null
 
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
              name: "From-Process",
              values: ["${stake_id}"]
            },{
              name: "Asset-Id",
              values: ["${alt_id}"]
            },{
              name: "Action",
              values: ["Staked"]
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
    console.log('res: ', res);
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
          start: tags?.['Start-Time'],
          locked: tags?.['Locked-Time'],
          token: tags?.['Asset-Id'],
          pushed_for: tags?.['Pushed-For'],
          timestamp : node?.block?.timestamp,
          cursor
        })
      })
    }

    return stakings

  } catch (error) {
    console.error("fetch user rewards faild.", error)
    return null
    
  }
}




export async function fetchPlayerWinings([{player_id,agent_id,alt_id},{size,cursor}]){
  console.log("fetchPlayerWinings",player_id,agent_id)
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
              name: "From-Process",
              values: ["${agent_id}","${alt_id}"]
            },{
              name: "Action",
              values: ["Win-Notice"]
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
    let winnings
    if(res?.length > 0){
      winnings = res.map(({node,cursor})=>{
        const tags = {}
        for (const {name,value} of node.tags) {
          tags[name] = value
        }
        return({
          id: node.id,
          prize: tags?.Prize,
          tax: tags?.Tax,
          round: tags?.Round,
          jackpot: tags?.Jackpot,
          lucky_number: tags?.['Lucky-Number'],
          created: tags?.Created,
          timestamp : node?.block?.timestamp,
          cursor
        })
      })
    }

    return winnings

  } catch (error) {
    console.error("fetch user winnings faild.", error)
    return null
    
  }
}



export async function fetchClaimApproveResult({msg_ids,agent_id}){
  console.log('fetchClaimApproveResult: ', msg_ids);
  if(!agent_id) throw new Error("Missed agent id")
  if(!msg_ids||!Array.isArray(msg_ids)||msg_ids.length <= 0) throw new Error("Missed message ids")
  try {
    const query_str =  `
      query{
        transactions(
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
              values: ["Transfer"]
            },{
              name: "X-Transfer-Type",
              values: ["Claim-Notice"]
            },{
              name: "X-Claim-Id",
              values: ${JSON.stringify(msg_ids)}
            }],
        ) {
          edges {
            node {
              id
              tags {
                name,
                value
              }
            }
          }
        }
      }
    `
    const res = await ao.query(query_str)

    let approved = {}
  
    if(res?.length > 0){
      for (const {node} of res) {
        const tags = {}
        for (const {name,value} of node.tags) {
          tags[name] = value
        }
        approved[tags?.['X-Claim-Id']] = node?.id
      }
    }

    return approved
  } catch (error) {
    console.error("fetch claim approve result faild.", error)
    throw error
  }
}