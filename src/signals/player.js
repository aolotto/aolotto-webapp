import { createResource, createRoot } from "solid-js";
import { fetchPlayerTickets,fetchPlayerAccount,fetchUserTokenBalances,fetchPlayerRewards,fetchPlayerCliams,fetchPlayerDividends,fetchPlayerMintings} from "../api/player";
import { protocols } from "./global";
import { address,connected } from "../components/wallet";
import { createPagination } from "../lib/page";
import { createStore } from "solid-js/store";
// import { ANT } from "@ar.io/sdk"

const [store,setStore] = createStore({})


export const [player,{refetch:refetchPlayer}] = createRoot(()=>createResource(()=>{
  if(connected()&&address()){
    return {player:address(),id:protocols?.agent_id}
  }
}, fetchPlayerAccount))

export const [balances,{refetch:refetchUserBalances}] = createRoot(()=>createResource(()=>{
  if(connected()){
    return {player_id:address(),token_ids:[protocols?.pay_id,protocols?.agent_id,protocols?.stake_id]}
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

// export const createUserAntProfile = async(signer) => {
//   const ant = ANT.init({
//     signer: signer,
//     processId: 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM'
//   });
//   const info = await ant.getInfo();
  
//   return info
// }