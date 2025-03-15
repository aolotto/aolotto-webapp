
import { createPagination } from "../lib/page";
import { fetchAltMinings,fetchAltDividends,fetchAltBuybacks } from "../api/lotto";
import { createStore } from "solid-js/store";
import { fetchDraws } from "../api/draws";
import { fetchPlayerTickets,fetchPlayerRewards,fetchPlayerCliams,fetchPlayerDividends,fetchPlayerMintings} from "../api/player";
// import { protocols } from "./global";
// import { address,connected } from "../components/wallet";


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

export const createUserTickets = (signal) => {
  if(!store.user_tickets){
    setStore("user_tickets",createPagination(signal,fetchPlayerTickets,{size:100}))
  }
  return store.user_tickets
}

export const createUserRewards = (signal) => {
  if(!store.user_rewards){
    setStore("user_rewards",createPagination(signal,fetchPlayerRewards,{size:100}))
  }
  return store.user_rewards
}


export const createUserClaims = (signal) => {
  if(!store.user_claims){
    setStore("user_claims",createPagination(signal,fetchPlayerCliams,{size:100}))
  }
  return store.user_claims
}

export const createUserMintings = (signal) => {
  if(!store.user_mintings){
    setStore("user_mintings",createPagination(signal,fetchPlayerMintings,{size:100}))
  }
  return store.user_mintings
}

export const createUserDividends = (signal) => {
  if(!store.user_dividends){
    setStore("user_dividends",createPagination(signal,fetchPlayerDividends,{size:100}))
  }
  return store.user_dividends
}


export const createDraws = (signal,fetcher,options) => {
  if(!store.draws){
    const res = createPagination(signal,fetcher||fetchDraws,{size:options?.size||100})
    setStore("draws",res)
  }
  return store.draws
}




