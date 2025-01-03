import { createRoot } from "solid-js"
import { createStore } from "solid-js/store"
import { AO } from "../lib/ao"

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
      if(!id){
        reject("Missed agent id")
        return
      }
      let cache_key = "AOLOTTO_PROTOCOLS_"+id
      if(localStorage?.getItem(cache_key)){
        setProtocols(JSON.parse(localStorage?.getItem(cache_key)))
        resolve(protocols)
        return
      }
      ao.dryrun({
        process: id,
        tags: {Action:"Protocols"}
      })
      .then(({Messages,Errors})=>{
        console.log(Errors)
        if(Messages?.length>0&&Messages?.[0]){
          const data = JSON.parse(Messages?.[0]?.Data)
          document.hasStorageAccess().then((hasAccess) => {
            if (hasAccess) {
              localStorage.setItem(cache_key,Messages?.[0]?.Data)
              console.log("已获得 cookie 访问权限");
            }
          });
          setProtocols(data)
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

