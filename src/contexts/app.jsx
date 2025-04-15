import { createContext, useContext, Suspense, createResource, createEffect} from "solid-js";
import { useWallet } from "arwallet-solid-kit";
import { fetchStats,fetchProcessInfo } from "../api";
import toast from "solid-toast";
const AppContext = createContext()

export const AppProvider = (props) => {
  const {address, connected} = useWallet()
  
  const info = {
    name : import.meta.env.VITE_APP_NAME,
    agent_process : import.meta.env.VITE_AGENT_PROCESS,
    pay_process : import.meta.env.VITE_PAY_PROCESS,
    pool_process : import.meta.env.VITE_POOL_PROCESS,
    faucet_process : import.meta.env.VITE_FAUCET_PROCESS,
    fundation_process : import.meta.env.VITE_FUNDATION_PROCESS,
    buyback_process :import.meta.env.VITE_BUYBACK_PROCESS,
    stake_process : import.meta.env.VITE_STAKE_PROCESS
  }
  const [agentProcess,{refetch:refetchAgentProcess}] = createResource(()=>info?.agent_process || import.meta.env.VITE_AGENT_PROCESS,fetchProcessInfo)
  const [payProcess,{refetch:refetchPayProcess}] = createResource(()=>info?.pay_process || import.meta.env.VITE_PAY_PROCESS,fetchProcessInfo)
  const [stakeProcess,{refetch:refetchStakeProcess}] = createResource(()=>info?.stake_process || import.meta.env.VITE_STAKE_PROCESS,fetchProcessInfo)
  const [poolProcess,{refetch:refetchPoolProcess}] = createResource(()=>info?.pool_process || import.meta.env.VITE_POOL_PROCESS,fetchProcessInfo)
  const [agentStats,{refetch:refetchAgentStats}] = createResource(()=>info?.agent_process || import.meta.env.VITE_AGENT_PROCESS,fetchStats)
  const hooks = {
    address,
    connected,
    info,
    agentStats,
    agentProcess,
    payProcess,
    stakeProcess,
    poolProcess,
    refetchAgentProcess,
    refetchPayProcess,
    refetchStakeProcess,
    refetchPoolProcess,
    refetchAgentStats,
    notify : (value,type) => {
      return toast.custom((t)=>(
        <div role="alert" className="alert alert-info w-full md:w-fit">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{value}</span>
        </div>
      ),{
        duration: 6000, 
      })
    }
  }
  

  return(
    <AppContext.Provider value={hooks}>{props.children}</AppContext.Provider>
  )
}

export const useApp = ()=> useContext(AppContext)



