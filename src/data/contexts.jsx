import { createContext, useContext, Suspense, createResource, createEffect,createRoot, onMount } from "solid-js";
import { useWallet } from "arwallet-solid-kit";
import { fetchAgentStats } from "../api/fetchers/agent"
const AppContext = createContext()

export const AppProvider = (props) => {
  const {address, connected} = useWallet()
  
  const info = {
    name : import.meta.env.VITE_APP_NAME,
    agent_process : import.meta.env.VITE_AGENT_PROCESS,
    pay_process : import.meta.env.VITE_PAY_PROCESS,
    faucet_process : import.meta.env.VITE_FAUCET_PROCESS,
    fundation_process : import.meta.env.VITE_FUNDATION_PROCESS,
    buyback_process :import.meta.env.VITE_BUYBACK_PROCESS,
    stake_process : import.meta.env.VITE_STAKE_PROCESS
  }
  const [agent_stats,{refetch:refetchAgentStats}] = createRoot(()=>createResource(()=>info?.agent_process || import.meta.env.VITE_AGENT_PROCESS,fetchAgentStats))
  const hooks = {
    address,
    connected,
    info,
    agent_stats,
    refetchAgentStats
  }
  // createEffect(()=>console.log("agent",agent()))
  onMount(()=>{
    console.log(agent_stats())
  })
  return(
    <AppContext.Provider value={hooks}>
      {props.children}
    </AppContext.Provider>
  )
}
export const useApp = ()=> useContext(AppContext)


