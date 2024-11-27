import { AO } from "../lib/ao"
let ao = new AO()

export async function fetchTokenBalance(params,{value,refetching}){
  const{player_id,token_id} = params
  if(!player_id || !token_id) return null
  let localData = sessionStorage.getItem('AOLOTTO-TOKENBALANCE-'+token_id+player_id)
  if(!localData || refetching){
    return await ao.dryrun({
      process: token_id,
      tags: { Action: "Balance", Recipient: player_id }
    })
    .then(({ Messages }) => {
      if (Messages?.length >= 1&& Messages[0].Data) {
        const data = JSON.parse(Messages[0].Data)
        if(data){
          sessionStorage.setItem('AOLOTTO-TOKENBALANCE-'+token_id+player_id,JSON.stringify(data))
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


export async function fetchPlayerAccount({player,pool},{refetching}){
  try {
    if(!player||!pool) return
    let key ='AOLOTTO-ACCOUNT-'+pool+player
    let localData = sessionStorage.getItem(key)
    if(!localData || refetching){
      return await ao.dryrun({
        process: pool,
        tags: { Action: "Get-Player", Player: player }
      })
      .then(({ Messages,Errors }) => {
        if (Messages?.length >= 1&& Messages[0].Data) {
          const data = JSON.parse(Messages[0].Data)
          if(data){
            sessionStorage.setItem(key,JSON.stringify(data))
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
    let cached = sessionStorage.getItem(key)
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
            sessionStorage.setItem(key,JSON.stringify(data))
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
  console.log("fetchPlayerTickets",player_id)

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
              values: ["Lotto-Notice"]
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
    console.log(query_str)
    const res = await ao.query(query_str)
    console.log("res",res)
    let bets
    if(res?.length > 0){
      bets = res.map(({node,cursor})=>{

        const tags = {}
        for (const {name,value} of node.tags) {
          tags[name] = value
        }
 
        return({
          id: node.id,
          ticket: tags?.['Pushed-For'],
          pool: tags?.Pool,
          token: tags?.Token,
          currency: tags?.Currency?.split(","),
          count: tags?.Count&&Number(tags?.Count),
          amount: tags?.Amount,
          store: tags.Store,
          round: tags.Round,
          x_numbers: tags['X-Numbers'],
          price : tags.Price,
          timestamp : node?.block?.timestamp,
          x_mine_amount : tags['X-Mine-Amount'],
          x_mine_currency : tags['X-Mine-Currency'],
          x_mine_token : tags['X-Mine-Token'],
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