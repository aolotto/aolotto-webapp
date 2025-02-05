
import { createPagination } from "../lib/page";
import { fetchDraws } from "../api/draws";
import { createStore } from "solid-js/store";

const [store,setStore] = createStore({})

export const createDraws = (signal,fetcher,options) => {
  if(!store.draws){
    const res = createPagination(signal,fetcher||fetchDraws,{size:options?.size||100})
    setStore("draws",res)
  }
  return store.draws
}

