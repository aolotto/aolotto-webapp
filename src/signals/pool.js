import { createStore } from "solid-js/store"
import { AO,findTagItemValues } from "../lib/ao"
import { protocols } from "./global"
import { createResource, createRoot } from "solid-js"
import { fetchPoolState, fetchStats, fetchActiveBets,fetchPoolMine,fetchPoolRanks } from "../api/pool"
import { createPagination } from "../lib/page"


export const [state,{refetch:refetchPoolState}] = createRoot(()=>createResource(()=>protocols.pool_id,fetchPoolState))
export const [stats,{refetch:refetchStats}] = createRoot(()=>createResource(()=>protocols.agent_id,fetchStats))
export const [ranks,{refetch:refetchPoolRanks}] = createRoot(()=>createResource(()=>protocols.agent_id,fetchPoolRanks))
// export const [mine, {refetch:refetchMine}] = createRoot(()=>createResource(()=>({pool_id:protocols.pool_id,agent_id:protocols.agent_id}),fetchPoolMine))
export const [bets,{hasMore,loadMore,page,refetch:refetchBets,loadingMore}] = createPagination(()=>protocols.pool_id, fetchActiveBets ,{size:100})
