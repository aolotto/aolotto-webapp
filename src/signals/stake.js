import { createRoot,createResource } from "solid-js"
import { protocols } from "./global"
import { fetchStakeState } from "../api/stake"

export const [stake_state,{refetch:refetchStakeState}] = createRoot(()=>createResource(()=>protocols?.stake_id,fetchStakeState))