import { createStore } from "solid-js/store"
import { AO,findTagItemValues } from "../lib/ao"
import { app } from "./global"
import { createResource, createRoot } from "solid-js"
import { fetchPoolState, fetchPoolStats, fetchActiveBets,fetchPoolMine,fetchPoolRanks } from "../api/pool"
import { createPagination } from "../lib/page"


export const [state,{refetch:refetchPoolState}] = createRoot(()=>createResource(()=>app.pool_id,fetchPoolState))
export const [stats,{refetch:refetchPoolStats}] = createRoot(()=>createResource(()=>app.pool_id,fetchPoolStats))
export const [ranks,{refetch:refetchPoolRanks}] = createRoot(()=>createResource(()=>app.pool_id,fetchPoolRanks))
export const [mine, {refetch:refetchMine}] = createRoot(()=>createResource(()=>({pool_id:app.pool_id,agent_id:app.agent_id}),fetchPoolMine))
export const [bets,{hasMore,loadMore,page,refetch:refetchBets,loadingMore}] = createPagination(()=>app.pool_id, fetchActiveBets ,{size:100})
