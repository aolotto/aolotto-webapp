import { storeResource } from "../../store"
import { createPagination } from "../../lib/pagination"
import { fetchPlayerMintings } from "../../api"
import { useApp, useWallet } from "../../contexts"
import Spinner from "../spinner"
import { createEffect, For, Suspense, Switch } from "solid-js"
import { toBalanceValue } from "../../lib/tools"
import { Moment } from "../moment"
import Loadmore from "../loadmore"
import { Icon } from "@iconify-icon/solid"

export default function Mintings(props) {
  const { info } = useApp()
  const { address } = useWallet()
  const [mintings,{ hasMore, loadingMore, loadMore }] = storeResource(
      `mintings_${info?.pool_process}_${address()}`,
      ()=>createPagination(
        ()=>({
          pool_id : info.pool_process, 
          agent_id : info.agent_process,
          alt_id : info.alt_process,
          player_id : address()
        }),
        fetchPlayerMintings,
        {size: 100}
      )
    )

  createEffect(()=>{
    console.log(mintings())
  })
  return(
    <div>
      <Suspense fallback={<Spinner className="w-full py-10"/>}>
       <Switch>
          <Match when={mintings()?.length == 0}>
            <div class="text-2xl font-bold text-white">No mintings</div>
          </Match>
          <Match when={mintings()?.length > 0}>
            <For each={mintings()}>
              {(minting) => (
                <div class=" flex items-center justify-between gap-4 px-2 py-4 border-b border-base-300 text-sm">
                  <div className="flex items-center gap-4 flex-wrap">
                    <p>{minting?.type == "Save-Ticket"? <span className="badge badge-accent badge-sm uppercase rounded-full">bet2mint</span>:<span  className="badge uppercase badge-sm badge-primary">Gap-reward</span>}</p>
                    <p>{toBalanceValue(minting?.amount,12)} $ALT</p>
                  </div>
                   <div className="text-sm text-current/50 flex items-center gap-2">
                      <Moment ts={minting?.mint_time&&Number(minting?.mint_time)}/>
                      <a href={`${info.ao_link_url}/#/message/${minting?.id}`} target="_blank">
                      <Icon icon="ei:external-link"/>
                      </a>
                      
                    </div>
                </div>
              )}
            </For>
            <Show when={hasMore()}>
              <div className="w-full py-4 flex justify-end ">
                <Loadmore loadMore={loadMore} loading={loadingMore()} />
              </div>
                
            </Show> 
          </Match>
      </Switch>
      </Suspense>
    </div>
  )
}