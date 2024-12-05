import { createUserTickets } from "../../signals/player"
import { connected,address } from "../../components/arwallet"
import { app, pool } from "../../signals/global"
import { createEffect, Match, Show, Switch } from "solid-js"
import { Xnumbers } from "../../components/xnumber"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Moment } from "../../components/moment"
import { Icon } from "@iconify-icon/solid"
import Ticker from "../../components/ticker"
import Loadmore from "../../components/loadmore"
import tooltip from "../../components/tooltip"

export default props => {
  const [tickets,{hasMore,loadMore,loadingMore}] = createUserTickets(()=>connected()&&{player_id:address(),pool_id:pool.id})
  createEffect(()=>console.log(tickets()))
  return(
    <section 
      class=" py-10 flex flex-col gap-4 "
      classList={props?.classList}
    >
      <For each={tickets()}>
        {(item,index)=><div class="response_cols p-2 hover:bg-current/5 gap-y-1 border-b border-current/10 lg:border-none rounded-md">
          <div class="col-span-full lg:col-span-3 flex items-center gap-2">
          <span>🎟️</span> 
          <span class="text-current/50" use:tooltip={["top",item.ticket]}>{shortStr(item.ticket,8)}</span>
          </div>
          <div class="col-span-full lg:col-span-9 flex items-center justify-between">
            <div><span class="text-current/50">Bet</span> $1.00 <span class="text-current/50">with</span> <Xnumbers value={item.x_numbers+"*"+item.count}/> <span class="text-current/50">in</span> Round-{item.round} <Show when={item.mining}><Icon icon="iconoir:arrow-right" class="text-current/50"/> {toBalanceValue(item.mining?.[0],item.mining?.[2],2)} <Ticker class="text-current/50">{item?.mining?.[1]}</Ticker></Show></div>
            <div class="flex items-center gap-4">
              <span class="text-current/50"><Moment ts={Number(item.created)}/></span>
              <a href={`${app.ao_link_url}/#/message/${item?.ticket}`} target="_blank"><Icon icon="ei:external-link"></Icon></a>
            </div>
          </div>
        </div>}
      </For>
      <Show when={hasMore()}>
        <Loadmore loadMore={loadMore} loading={loadingMore()}/>
      </Show>
    </section>
  )
}