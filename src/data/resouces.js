// import { createStore } from "solid-js/store"
// import { AO,findTagItemValues } from "../lib/ao"
import { protocols } from "./info"
import { createResource, createRoot } from "solid-js"
import { fetchPoolState, fetchStats } from "../api/pool"
import { address,connected } from "../components/wallet"
import { fetchPlayerAccount } from "../api/player"
import { fetchStakeState } from "../api/stake"
import { fetchTokenBalance } from "../api/balance"



// public
export const [stats,{refetch:refetchStats}] = createRoot(()=>createResource(()=>protocols?.agent_id,fetchStats))
export const [pool,{refetch:refetchPool}] = createRoot(()=>createResource(()=>protocols?.pool_id,fetchPoolState))
export const [stake,{refetch:refetchStake}] = createRoot(()=>createResource(()=>protocols?.stake_id,fetchStakeState))
export const [USDC,{refetch:refetchUSDC}] = createRoot(()=>createResource(()=>{
  if(connected()){return {address: address(), token_id: protocols?.pay_id}}
},fetchTokenBalance))
export const [ALT,{refetch:refetchALT}] = createRoot(()=>createResource(()=>{
  if(connected()){return {address: address(), token_id: stats()&&protocols?.agent_id}}
},fetchTokenBalance))

// users
export const [player,{refetch:refetchPlayer}] = createRoot(()=>createResource(()=>{
  if(connected()&&stats.state == "ready"){return {player:address(),id:ALT()&&protocols?.agent_id}}
}, fetchPlayerAccount))

