import { createContext, useContext, Suspense, createResource, createEffect,createRoot, onMount,createMemo } from "solid-js";
import { useWallet } from "arwallet-solid-kit";
import { useApp } from "./index";
import { fetchBalance,fetchAccount } from "../api";
import Account from "../compontents/account/index";
const UserContext = createContext()

export const UserProvider = (props) => {
  let _account
  const {address, connected} = useWallet()
  const {info,agentProcess,payProcess,stakeProcess} = useApp()
  const [player,{refetch:refetchPlayer}] = createResource(()=>({id:info?.agent_process,player:address()}),fetchAccount)
  const [usdcBalance,{refetch:refetchUsdcBalance}] = createResource(()=>({pid:info?.pay_process,address:address()}),fetchBalance)
  const [altBalance,{refetch:refetchAltBalance}] = createResource(()=>({pid:info?.agent_process,address:address()}),fetchBalance)
  const [veAltBalance,{refetch:refetchVeAltBalance}] = createResource(()=>({pid:info?.stake_process,address:address()}),fetchBalance)
  

  const balances = createMemo(()=>([{
      Ticker : payProcess()?.Ticker || "wUSDC",
      Denomination : payProcess()?.Denomination || "6",
      Logo : payProcess()?.Logo || "VL4_2p40RKvFOQynAMilDQ4lcwjtlK3Ll-xtRhv9GSY",
      resource : usdcBalance,
      refetch : refetchUsdcBalance
    },{
      Ticker : agentProcess()?.Ticker || "ALT",
      Denomination : agentProcess()?.Denomination || "12",
      Logo : agentProcess()?.Logo || "KmN0EfZguGLBPg4z5zz3JfEAgVs6v1MSMKFlqb_wF-I",
      resource : altBalance,
      refetch : refetchAltBalance
    },{
      Ticker : stakeProcess()?.Ticker || "veALT",
      Denomination : stakeProcess()?.Denomination || "12",
      Logo : stakeProcess()?.Logo || "bcwIgXwW2C1OMG8paTtDZtAVPp16cOQlvp3_qnS16eg",
      resource : veAltBalance,
      refetch : refetchVeAltBalance
    }]
  ))
  const hooks = {
    player,
    refetchPlayer,
    address:address(),
    openAccount: (tab)=>_account.open(tab),
    balances,
    usdcBalance,
    altBalance,
    veAltBalance,
    refetchUsdcBalance,
    refetchAltBalance,
    refetchVeAltBalance
  }
  return(
    <UserContext.Provider value={hooks}>
      {props.children}
      <Show when={connected()}>
        <Account ref={_account}/>
      </Show>
    </UserContext.Provider>
  )
}



export const useUser = ()=> useContext(UserContext)

