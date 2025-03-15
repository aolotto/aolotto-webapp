// import { createStore } from "solid-js/store"
// import { AO,findTagItemValues } from "../lib/ao"
import { protocols } from "./info"
import { createResource, createRoot } from "solid-js"
import { fetchPoolState, fetchStats } from "../api/pool"


import { address,connected } from "../components/wallet"
import { fetchPlayerAccount,fetchUserTokenBalances } from "../api/player"
import { fetchStaker } from "../api/player"
import { fetchStakeState } from "../api/stake"
import { fetchTokenBalance } from "../api/balance"



// root state
export const [stats,{refetch:refetchStats}] = createRoot(()=>createResource(()=>protocols?.agent_id,fetchStats))
export const [pool,{refetch:refetchPool}] = createRoot(()=>createResource(()=>protocols?.pool_id,fetchPoolState))
export const [stake,{refetch:refetchStake}] = createRoot(()=>createResource(()=>protocols?.stake_id,fetchStakeState))
export const [USDC,{refetch:refetchUSDC}] = createRoot(()=>createResource(()=>{
  if(connected()){return {address: address(), token_id: protocols?.pay_id}}
},fetchTokenBalance))
export const [ALT,{refetch:refetchALT}] = createRoot(()=>createResource(()=>{
  if(connected()){return {address: address(), token_id: stats()&&protocols?.agent_id}}
},fetchTokenBalance))




// public
// export const [mine, {refetch:refetchMine}] = createRoot(()=>createResource(()=>({pool_id:protocols.pool_id,agent_id:protocols.agent_id}),fetchPoolMine))
// export const [bets,{hasMore,loadMore,page,refetch:refetchBets,loadingMore}] = createPagination(()=>protocols?.pool_id, fetchActiveBets ,{size:100})
// export const [holders,{refetch:refetchHodlers}] = createResource(()=>stats.state=="ready"&&protocols.agent_id,fetchTotalTokenHodlers)
// export const [supply,{refetch:refetchSupply}] = createResource(()=>stats.state=="ready"&&protocols.agent_id,fetchTokenSupply)

// users
export const [player,{refetch:refetchPlayer}] = createResource(()=>{
  if(connected()&&stats.state == "ready"){return {player:address(),id:stats()&&protocols?.agent_id}}
}, fetchPlayerAccount)

// export const [balances,{refetch:refetchUserBalances}] = createResource(()=>{
//   if(connected()){return {player_id:address(),token_ids:[protocols?.pay_id,stats()&&protocols?.agent_id]}}
// },function(){return [0,0]})

// export const [staker,{refetch:refetchStaker}] = createResource(()=>{
//   if(connected()&&stake.state == "ready"){return {staker:address(),pid: stake()&&protocols?.stake_id}}
// },fetchStaker)