import { For, Suspense, Switch } from "solid-js"
import { createPagination } from "../../lib/pagination"
import { storeResource } from "../../store"
import { fetchPlayerTickets } from "../../api"
import { useApp,useWallet } from "../../contexts"
import Spinner from "../spinner"
import  { toBalanceValue } from "../../lib/tools"
import  { Moment } from "../moment"
import { Icon } from "@iconify-icon/solid"
import Loadmore from "../loadmore"

export default function Tickets(props) {
  const { info } = useApp()
  const { address } =  useWallet()
  const [tickets,{ hasMore, loadingMore, loadMore }] = storeResource(
    `tickets_${info?.pool_process}_${address()}`,
    ()=>createPagination(
      ()=>({pool_id : info.pool_process, player_id : address()}),
      fetchPlayerTickets,
      {size: 100}
    )
  )
  return (
    <div>
      <Suspense fallback={<Spinner className="w-full py-10"/>}>
        {/* {tickets()?.length} */}
        <Switch>
          <Match when={tickets()?.length === 0}>
            <div class="text-center text-sm text-current/50 py-10">
              No tickets found
            </div>
          </Match>
          <Match when={tickets()?.length > 0}>
            <ul className=" divide-y divide-base-300">
            <For each={tickets()}>
              {(ticket) => (
                <li class=" flex items-center justify-between gap-4 py-4 px-1">
                  <div className="flex items-center gap-4 flex-wrap text-sm">
                    <span className=" font-bold">${toBalanceValue(ticket?.amount || 0,6)} </span>
                    <span>
                      <For each={ticket?.x_numbers?.split('')||["*","*","*"]}>
                        {(num) => <span class="ball ball-fill size-6 text-md">{num}</span>}
                      </For>
                    </span>
                    <span>on R7</span>
                  </div>
                  
                  <div className="text-sm text-current/50 flex items-center gap-2">
                    <Moment ts={Number(ticket?.created)}/>
                    <a href={`${info.ao_link_url}/#/message/${ticket?.id}`} target="_blank">
                    <Icon icon="ei:external-link"/>
                    </a>
                    
                  </div>
                </li>
              )}
            </For>

            </ul>
        
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