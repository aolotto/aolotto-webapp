import { createResource, createRoot } from "solid-js";
import { fetchPlayerTickets,fetchPlayerAccount,fetchUserTokenBalances,fetchPlayerRewards} from "../api/player";
import { pool,currency,agent } from "./global";
import { address,connected } from "../components/arwallet";
import { createPages } from "../lib/page";

export const createPlayerAccount = (signal) => createResource(signal, fetchPlayerAccount)

export const [balances,{refetch:refetchUserBalances}] = createRoot(()=>createResource(()=>{
  if(connected()){
    return {player_id:address(),token_ids:[currency.id,agent.id]}
  }
},fetchUserTokenBalances))

export const createPlayerTickets = (signal) => createPages(signal,fetchPlayerTickets,{size:100})
export const createPlayerRewards = (signal) => createPages(signal,fetchPlayerRewards,{size:100})


