import { createRoot } from "solid-js"
import { createStore } from "solid-js/store"
import { AO } from "../lib/ao"

let ao = new AO()

export const {initApp,app,setApp}  = createRoot(()=>{
  const [app,setApp] = createStore({
    name: "Aolotto",
    host: "https://www.aolotto.com",
    arns: "aolotto",
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

export const {initProtocols,protocols,setProtocols} = createRoot(()=>{
  const [protocols,setProtocols] = createStore()
  return ({
    initProtocols : (id,version)=> new Promise((resolve, reject) => {
      console.log("init Protocols",id,version)
      if(!id){
        reject("Missed agent id")
        return
      }
      let cache_key = "AOLOTTO_PROTOCOLS_"+id+(version||"0")
      let data = sessionStorage.getItem(cache_key) ? JSON.parse(sessionStorage?.getItem(cache_key)) : null
      if(data){
        // data = JSON.parse(sessionStorage?.getItem(cache_key))
        setProtocols({
          agent_id : data?.agent_id || import.meta.env.VITE_AGENT_PROCESS,
          pay_id : data?.pay_id || import.meta.env.VITE_PAY_PROCESS,
          pool_id : data?.pool_id || import.meta.env.VITE_POOL_PROCESS,
          facuet_id : data?.facuet_id || import.meta.env.VITE_FAUCET_PROCESS,
          fundation_id : data?.fundation_id || import.meta.env.VITE_FUNDATION_PROCESS,
          buybacks_id : data.buybacks_id || import.meta.env.VITE_BUYBACK_PROCESS,
          stake_id : data.stake_id || import.meta.env.VITE_STAKE_PROCESS,
          owner_id : data.owner_id,
          details : data.details
        })
        resolve(protocols)
        return
      }else{
        ao.dryrun({
          process: id,
          tags: {Action:"Protocols"}
        })
        .then(({Messages,Errors})=>{
          console.log(Errors)
          if(Messages?.length>0&&Messages?.[0]){
            const res = JSON.parse(Messages?.[0]?.Data)
            sessionStorage.setItem(cache_key,Messages?.[0]?.Data)
            setProtocols(res)
            resolve(protocols)
          } else {
            throw new Error("fetch protocols error")
          }
        })
        .catch((err)=>{
          console.log(err)
          reject("init protocols faild.")
        })

      }
      
      
    }),
    protocols,
    setProtocols,
  })
})

