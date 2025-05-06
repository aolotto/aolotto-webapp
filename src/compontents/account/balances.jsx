import { ErrorBoundary, For, Show } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { useApp,useUser } from "../../contexts"
import { toBalanceValue } from "../../lib/tools"
export default props => {
  const {info} = useApp()
  const {balances} = useUser()
  const tokens = [{
    Ticker : "wUSDC",
    Logo : "VL4_2p40RKvFOQynAMilDQ4lcwjtlK3Ll-xtRhv9GSY",
    Process : info.pay_process,
    Denomination : 6,
    Actions : []
  },{
    Ticker : "ALT",
    Logo : "KmN0EfZguGLBPg4z5zz3JfEAgVs6v1MSMKFlqb_wF-I",
    Process : info.agent_process,
    Denomination : 12,
    Actions : []
  },{
    Ticker : "veALT",
    Logo : "bcwIgXwW2C1OMG8paTtDZtAVPp16cOQlvp3_qnS16eg",
    Process : info.stake_process,
    Denomination : "6",
    Actions : []
  }]
  return (
    <ul className="flex flex-col gap-1 py-4">
     <For each={balances()}>
        {item=>{
          return(
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="ph:arrow-elbow-down-right-light" className="ml-1 text-current/50 scale-90"/>
                <span className="rounded-full size-5 bg-base-300">
                  <img src={`https://arweave.net/${item.Logo}`} alt={item.Name||item.Ticker} />
                </span>
                <span className="text-current/50 text-xs">{item.Ticker} </span>
              </div>
              <div className="flex justify-end gap-1 items-center">
                <div>
                <ErrorBoundary fallback={"error"}>
                  <Show when={!item.resource.loading} fallback={<span className="skeleton w-[4em] h-[1em] inline-block"></span>}>
                    <span classList={{
                      "text-current" : item.resource() > 0,
                      "text-current/50" : !item.resource() || item.resource() <= 0 
                    }}>
                      {toBalanceValue(item.resource()||0,item.Denomination,item.Denomination)}
                    </span>
                  </Show>
                  </ErrorBoundary>
                </div>

                <button role="button" onClick={item.refetch} disabled={item.resource.loading} className="btn btn-circle btn-ghost btn-sm">
                <Icon icon="material-symbols-light:refresh-rounded" />
                </button>
              </div>
           </li>
          )
        }}
     </For>
    </ul>
  )
}