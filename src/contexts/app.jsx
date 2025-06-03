import { createContext, useContext, Suspense, createResource, createEffect, Switch, Match} from "solid-js";
import { useWallet } from "arwallet-solid-kit";
import { fetchStats,fetchProcessInfo } from "../api";
import toast from "solid-toast";
import intervalWorker from "../lib/interval_worker"
import swap from "daisyui/components/swap";

const AppContext = createContext()

export const AppProvider = (props) => {
  let timer = new Worker(intervalWorker);
  const {address, connected} = useWallet()
  
  const info = {
    name : import.meta.env.VITE_APP_NAME,
    agent_process : import.meta.env.VITE_AGENT_PROCESS,
    pay_process : import.meta.env.VITE_PAY_PROCESS,
    pool_process : import.meta.env.VITE_POOL_PROCESS,
    faucet_process : import.meta.env.VITE_FAUCET_PROCESS,
    fundation_process : import.meta.env.VITE_FUNDATION_PROCESS,
    buyback_process :import.meta.env.VITE_BUYBACK_PROCESS,
    stake_process : import.meta.env.VITE_STAKE_PROCESS,
    swap_process : import.meta.env.VITE_ALT_WUSDC_PROCESS,
    alt_process : import.meta.env.VITE_ALT_PROCESS,
    ao_link_url : import.meta.env.VITE_AO_LINK_URL || "https://ao.link",
  }
  const [agentProcess,{refetch:refetchAgentProcess}] = createResource(()=>info?.agent_process || import.meta.env.VITE_AGENT_PROCESS,fetchProcessInfo)
  const [payProcess,{refetch:refetchPayProcess}] = createResource(()=>info?.pay_process || import.meta.env.VITE_PAY_PROCESS,fetchProcessInfo)
  const [stakeProcess,{refetch:refetchStakeProcess}] = createResource(()=>info?.stake_process || import.meta.env.VITE_STAKE_PROCESS,fetchProcessInfo)
  const [poolProcess,{refetch:refetchPoolProcess}] = createResource(()=>info?.pool_process || import.meta.env.VITE_POOL_PROCESS,fetchProcessInfo)
  const [altProcess,{refetch:refetchAltProcess}] = createResource(()=>info?.alt_process || import.meta.env.VITE_ALT_PROCESS,fetchProcessInfo)
  const [agentStats,{refetch:refetchAgentStats}] = createResource(()=>info?.agent_process || import.meta.env.VITE_AGENT_PROCESS,fetchStats)
  const hooks = {
    timer,
    address,
    connected,
    info,
    agentStats,
    agentProcess,
    payProcess,
    stakeProcess,
    poolProcess,
    altProcess,
    refetchAgentProcess,
    refetchAltProcess,
    refetchPayProcess,
    refetchStakeProcess,
    refetchPoolProcess,
    refetchAgentStats,
    notify : (value,type) => {
      const genAlertBox = (type) => {
        switch(type){
          case "error":
            return <div role="alert" className={`alert alert-error w-fit max-w-[360px] shadow-sm`}><div>{value}</div></div>
          case "success":
            return <div role="alert" className={`alert alert-success w-fit max-w-[360px] shadow-sm`}><div>{value}</div></div>
          default:
            return <div role="alert" className={`alert alert-info w-fit max-w-[360px] shadow-sm`}><div>{value}</div></div>
        }
      }
      return toast.custom((t)=>{
        return(
          <div className={`${t.visible ? 'animate-scale-in' : 'animate-scale-out'}`}>
            {genAlertBox(type)}
          </div>
        )
      },{
        duration: 6000
      })
    }
  }
  

  return(
    <AppContext.Provider value={hooks}>{props.children}</AppContext.Provider>
  )
}

export const useApp = ()=> useContext(AppContext)



