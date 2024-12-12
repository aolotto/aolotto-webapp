
import { createPagination } from "../lib/page";
import { fetchLottoMinings,fetchLottoDividends,fetchTotalTokenHodlers,fetchTokenSupply } from "../api/lotto";
import { createStore } from "solid-js/store";
import { createResource,createRoot } from "solid-js";
import { app } from "./global";


const [store,setStore] = createStore({})

export const createMinings = (signal,fetcher,options) => {
  if(!store.minings){
    const res = createPagination(signal,fetcher||fetchLottoMinings,{size:options?.size||50})
    setStore("minings",res)
  }
  return store.minings
}

export const createDividends = (signal,fetcher,options)=>{
  if(!store.dividends){
    const res = createPagination(signal,fetcher||fetchLottoDividends,{size:options?.size||50})
    setStore("dividends",res)
  }
  return store.dividends
}


export const [holders,{refetch:refetchHodlers}] = createRoot(()=>createResource(()=>app.agent_id,fetchTotalTokenHodlers))
export const [supply,{refetch:refetchSupply}] = createRoot(()=>createResource(()=>app.agent_id,fetchTokenSupply))
