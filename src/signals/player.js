import { createResource, createRoot } from "solid-js";
import { fetchPlayerTickets,fetchPlayerAccount,fetchUserTokenBalances,fetchPlayerRewards,fetchPlayerCliams,fetchPlayerDividends,fetchPlayerMintings} from "../api/player";
import { currency,agent } from "./global";
import { address,connected } from "../components/arwallet";
import { createPagination } from "../lib/page";
import { createStore } from "solid-js/store";

const [store,setStore] = createStore({})

export const createPlayerAccount = (signal) => createResource(signal, fetchPlayerAccount)

export const [balances,{refetch:refetchUserBalances}] = createRoot(()=>createResource(()=>{
  if(connected()){
    return {player_id:address(),token_ids:[currency.id,agent.id]}
  }
},fetchUserTokenBalances))


export const createUserTickets = (signal) => {
  if(!store.tickets){
    setStore("tickets",createPagination(signal,fetchPlayerTickets,{size:100}))
  }
  return store.tickets
}

export const createUserRewards = (signal) => {
  if(!store.rewards){
    setStore("rewards",createPagination(signal,fetchPlayerRewards,{size:100}))
  }
  return store.rewards
}


export const createUserClaims = (signal) => {
  if(!store.claims){
    setStore("claims",createPagination(signal,fetchPlayerCliams,{size:100}))
  }
  return store.claims
}

export const createUserMintings = (signal) => {
  if(!store.mintings){
    setStore("mintings",createPagination(signal,fetchPlayerMintings,{size:100}))
  }
  return store.mintings
}

export const createUserDividends = (signal) => {
  if(!store.dividends){
    setStore("dividends",createPagination(signal,fetchPlayerDividends,{size:100}))
  }
  return store.dividends
}