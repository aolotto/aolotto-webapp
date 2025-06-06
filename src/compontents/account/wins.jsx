import { storeResource } from "../../store"
import { createPagination } from "../../lib/pagination"
import { fetchPlayerWinings } from "../../api"
import { useApp, useWallet } from "../../contexts"
import Loadmore from "../loadmore"
import { createEffect, For, Match, Suspense, Switch } from "solid-js"
import { Moment } from "../moment"
import { toBalanceValue } from "../../lib/tools"
import  Empty from "../empty"

export default function Wins(props) {
  const { info } = useApp()
  const { address } = useWallet()
  const [wins,{ hasMore, loadingMore, loadMore }] = storeResource(
      `wins_${info?.agent_process}_${address()}`,
      ()=>createPagination(
        ()=>({
          agent_id : info.agent_process,
          alt_id : info.alt_process,
          player_id : address()
        }),
        fetchPlayerWinings,
        {size: 100}
      )
    )
  createEffect(()=>{
    console.log(wins())
  })
  return(
    <div class = " divide-y divide-base-300">
      <Switch>
        <Match when={wins()?.length > 0}>
          <For each={wins()}>
            {(win) => (
              <div class=" flex items-center justify-between gap-4 px-2 py-4 ">
                <div className="flex items-center gap-4 flex-wrap">
                  <p>R{win?.round} - </p>
                  <p>${toBalanceValue(win?.prize,6)}</p>
                </div>
                <div className="text-sm text-current/50"><Moment ts={win?.timestamp * 1000}/></div>
              </div>
            )}
          </For>
          <Show when={hasMore()}>
            <Loadmore loadMore={loadMore} loading={loadingMore()} />
          </Show> 
        </Match>
        <Match when={wins()?.length <= 0 || wins() == undefined}>
          <Empty tips="No winnings yet" />
        </Match>
      </Switch>
     
      
    </div>
  )
}