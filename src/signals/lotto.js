
import { createPagination } from "../lib/page";
import { fetchLottoMinings,fetchLottoDividends } from "../api/lotto";
import { createStore } from "solid-js/store";


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

