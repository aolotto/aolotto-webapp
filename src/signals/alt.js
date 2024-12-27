
import { createPagination } from "../lib/page";
import { fetchAltMinings,fetchAltDividends,fetchTotalTokenHodlers,fetchTokenSupply,fetchAltBuybacks } from "../api/lotto";
import { createStore } from "solid-js/store";
import { createResource,createRoot } from "solid-js";
import { app } from "./global";


const [store,setStore] = createStore({})

export const createMinings = (signal,fetcher,options) => {
  if(!store.minings){
    const res = createPagination(signal,fetcher||fetchAltMinings,{size:options?.size||50})
    setStore("minings",res)
  }
  return store.minings
}

export const createDividends = (signal,fetcher,options)=>{
  if(!store.dividends){
    const res = createPagination(signal,fetcher||fetchAltDividends,{size:options?.size||50})
    setStore("dividends",res)
  }
  return store.dividends
}

export const createBuybacks = (signal,fetcher,options)=>{
  if(!store.buybacks){
    const res = createPagination(signal,fetcher||fetchAltBuybacks,{size:options?.size||50})
    setStore("buybacks",res)
  }
  return store.buybacks
}


export const [holders,{refetch:refetchHodlers}] = createRoot(()=>createResource(()=>app.agent_id,fetchTotalTokenHodlers))
export const [supply,{refetch:refetchSupply}] = createRoot(()=>createResource(()=>app.agent_id,fetchTokenSupply))
