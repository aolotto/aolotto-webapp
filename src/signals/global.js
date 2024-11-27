import { createRoot } from "solid-js"
import { createStore } from "solid-js/store"
import { AO,findTagItemValues } from "../lib/ao"

let ao = new AO()

export const {initApp,app,setApp}  = createRoot(()=>{
  const [app,setApp] = createStore({
    name: "Aolotto",
    host: "http://www.aolotto.com",
    arns: "aolotto"
  })
  return ({
    initApp: (params)=>{
      setApp(params)
      return app
    },
    app,
    setApp
  })
})


export const {initPool,pool,setPool} = createRoot(()=>{
  const [pool,setPool] = createStore()
  return ({
    initPool: (id)=>new Promise((resolve, reject) => {
      let cache_key = "AOLOTTO_POOL_INFO_"+id
      if(localStorage.getItem(cache_key)){
        setPool(JSON.parse(localStorage.getItem(cache_key)))
        resolve(pool)
        return
      }
      ao.dryrun({
        process: id || app.pool_id,
        tags: {Action:"Info"}
      })
      .then(({Messages,Errors})=>{
        if(Messages.length>0&&Messages[0]){
          const [
            name,
            tax,
            price,
            digits,
            draw_delay,
            jackpot_scale,
            withdraw_min,
            max_bet,
            pool_type,
            token,
            denomination,
            ticker,
            logo
          ] = findTagItemValues([
            'Name',
            'Tax',
            'Price',
            'Digits',
            'Draw-Delay',
            'Jackpot-Scale',
            'Withdraw-Min',
            'Max-Bet',
            'Pool-Type',
            'Token',
            'Token-Denomination',
            'Token-Ticker',
            'Token-Logo'
          ],Messages[0]?.Tags)
          const data = {
            id,
            name,
            asset_bet:[ticker,denomination,token,logo],
            tax,
            price,
            digits,
            draw_delay,
            jackpot_scale,
            withdraw_min,
            max_bet,
            pool_type,
            token,
            denomination,
            logo,
            ticker
          }
          localStorage.setItem(cache_key,JSON.stringify(data))
          setPool(data)
          resolve(pool)
        } else {
          throw new Error("fetch pool info error")
        }
      })
      .catch((err)=>{
        console.log(err)
        reject("init pool faild.")
      })
    }),
    setPool,
    pool
  })
})


export const {initAgent,agent} = createRoot(()=>{
  const [agent,setAgent] = createStore()
  return({
    initAgent: (id)=>new Promise((resolve, reject) =>{
      let cache_key = "AOLOTTO_AGENT_INFO_"+id
      if(localStorage.getItem(cache_key)){
        setAgent(JSON.parse(localStorage.getItem(cache_key)))
        resolve(agent)
        return
      }
      ao.dryrun({
        process: id || app.agent_id,
        tags: {Action:"Info"}
      })
      .then(({Messages,Errors})=>{
        if(Messages.length>0&&Messages[0]){
          const [
            name,
            ticker,
            denomination,
            logo
          ] = findTagItemValues([
            "Name",
            "Ticker",
            "Denomination",
            "Logo"
          ],Messages[0]?.Tags)

          const data = {
            id,name,ticker,denomination,logo
          }
          localStorage.setItem(cache_key,JSON.stringify(data))
          setAgent(data)
          resolve(agent)
        }else{
          throw new Error("fetch agent info error")
        }
      })
      .catch((err)=>{
        console.log(err)
        reject("init agent faild.")
      })
    }),
    agent
  })
})

export const {initCurrency,currency} = createRoot(()=>{
  const [currency,setCurrency] = createStore()
  return({
    initCurrency: (id)=>new Promise((resolve, reject) =>{
      let cache_key = "AOLOTTO_CURRENCY_INFO_"+id
      if(localStorage.getItem(cache_key)){
        setCurrency(JSON.parse(localStorage.getItem(cache_key)))
        resolve(currency)
        return
      }
      ao.dryrun({
        process: id || app.token_id,
        tags: {Action:"Info"}
      })
      .then(({Messages,Errors})=>{
        if(Messages.length>0&&Messages[0]){
          const [
            name,
            ticker,
            denomination,
            logo
          ] = findTagItemValues([
            "Name",
            "Ticker",
            "Denomination",
            "Logo"
          ],Messages[0]?.Tags)

          const data = {
            id,name,ticker,denomination,logo
          }
          localStorage.setItem(cache_key,JSON.stringify(data))
          setCurrency(data)
          resolve(currency)
        }else{
          throw new Error("fetch currency info error")
        }
      })
      .catch((err)=>{
        console.log(err)
        reject("init currency faild.")
      })
    }),
    currency
  })
})