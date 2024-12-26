import { createRoot } from "solid-js"
import { createStore } from "solid-js/store"
import { AO,findTagItemValues } from "../lib/ao"

let ao = new AO()

export const {initApp,app,setApp}  = createRoot(()=>{
  const [app,setApp] = createStore({
    name: "Aolotto",
    host: "https://www.aolotto.com",
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

export const {initProtocols,protocols,setProtocols} = createRoot(()=>{
  const [protocols,setProtocols] = createStore()
  return ({
    initProtocols : (id)=> new Promise((resolve, reject) => {
      console.log("init Protocols",id)
      let cache_key = "AOLOTTO_PROTOCOLS_"+id
      if(localStorage.getItem(cache_key)){
        setProtocols(JSON.parse(localStorage.getItem(cache_key)))
        resolve(protocols)
        return
      }
      ao.dryrun({
        process: id || app.protocol_id,
        tags: {Action:"Protocols"}
      })
      .then(({Messages,Errors})=>{
        console.log(Errors)
        if(Messages.length>0&&Messages[0]){
          const data = JSON.parse(Messages[0]?.Data)
          localStorage.setItem(cache_key,Messages[0]?.Data)
          setProtocols(data)
          console.log(data)
          resolve(protocols)
        } else {
          throw new Error("fetch protocols error")
        }
      })
      .catch((err)=>{
        console.log(err)
        reject("init protocols faild.")
      })
    }),
    protocols,
    setProtocols,
  })
})

