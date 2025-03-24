// import { createStore } from "solid-js/store"
// import { AO,findTagItemValues } from "../lib/ao"
import { protocols } from "./info"
import { createResource, createRoot } from "solid-js"
import { fetchPoolState, fetchStats } from "../api/pool"
import { address } from "../components/wallet"
import { fetchPlayerAccount } from "../api/player"
import { fetchStakeState } from "../api/stake"
import { fetchTokenBalance } from "../api/balance"



// public
export const [stats,{refetch:refetchStats}] = createRoot(()=>createResource(()=>protocols?.agent_id,fetchStats))
export const [pool,{refetch:refetchPool}] = createRoot(()=>createResource(()=>protocols?.pool_id,fetchPoolState))
export const [stake,{refetch:refetchStake}] = createRoot(()=>createResource(()=>protocols?.stake_id,fetchStakeState))


// users
export const [USDC,{refetch:refetchUSDC}] = createRoot(()=>createResource(()=>({address: address(), token_id: protocols?.pay_id}),fetchTokenBalance))
export const [ALT,{refetch:refetchALT}] = createRoot(()=>createResource(()=>({address: address(), token_id: protocols?.agent_id}),fetchTokenBalance))
export const [player,{refetch:refetchPlayer}] = createRoot(()=>createResource(()=>({player: address(),id: protocols?.agent_id,}), fetchPlayerAccount))

