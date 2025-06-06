import { storeResource } from "../../store"
import { createPagination } from "../../lib/pagination"
import { fetchPlayerStakings } from "../../api"
import { useApp, useWallet } from "../../contexts"
import Spinner from "../spinner"
import { createEffect, For, Suspense, Switch } from "solid-js"
import { toBalanceValue } from "../../lib/tools"
import { Moment } from "../moment"
import { Icon } from "@iconify-icon/solid"

export default function Stakings(props) {
  const { info } = useApp()
  const { address } = useWallet()
  const [stakings,{ hasMore, loadingMore, loadMore }] = storeResource(
      `stakings_${info?.stake_process}_${address()}`,
      ()=>createPagination(
        ()=>({
          stake_id : info.stake_process, 
          agent_id : info.agent_process,
          alt_id : info.alt_process,
          player_id : address()
        }),
        fetchPlayerStakings,
        {size: 100}
      )
    )

  createEffect(()=>{
    console.log(stakings())
  })
  return(
    <div>
      <Suspense fallback={<Spinner className="w-full py-10"/>}>
       <Switch>
          <Match when={stakings()?.length == 0}>
            <div class="text-2xl font-bold ">No stakings</div>
          </Match>
          <Match when={stakings()?.length > 0}>
            <For each={stakings()}>
              {(item) => (
                <div class=" flex items-center justify-between gap-4 py-4 px-1 border-b border-base-300 text-sm">
                  <div className="flex items-center gap-4 flex-wrap">
                    <Icon icon="iconoir:lock" />
                    <p>{toBalanceValue(item?.quantity,12)} <span className="text-current/50">$ALT</span></p>
                  </div>
                  <div className="text-sm text-current/50 flex items-center gap-2">
                    <Moment ts={item?.start&&Number(item?.start)}/>
                    <a href={`${info.ao_link_url}/#/message/${item?.id}`} target="_blank">
                      <Icon icon="ei:external-link"/>
                    </a>
                  </div>
                </div>
              )}
            </For>
          </Match>
      </Switch>
      </Suspense>
    </div>
  )
}