import { createUserTickets } from "../../signals/player"
import { connected,address } from "../../components/arwallet"
import { pool } from "../../signals/global"
import { createEffect, Match, Show, Switch } from "solid-js"
import { Xnumbers } from "../../components/xnumber"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Moment } from "../../components/moment"
import { Icon } from "@iconify-icon/solid"
import Ticker from "../../components/ticker"
import Loadmore from "../../components/loadmore"

export default props => {
  const [tickets,{hasMore,loadMore,loadingMore}] = createUserTickets(()=>connected()&&{player_id:address(),pool_id:pool.id})
  createEffect(()=>console.log(tickets()))
  return(
    <section 
      class=" py-10 flex flex-col gap-4 "
      classList={props?.classList}
    >
      <For each={tickets()}>
        {(item,index)=><div class="response_cols p-1 hover:bg-current/5 gap-y-1 border-b border-current/10 lg:border-none">
          <div class="col-span-full lg:col-span-3">
          🎟️ <span class="text-current/50">{shortStr(item.ticket,8)}</span>
          </div>
          <div class="col-span-full lg:col-span-9 flex items-center justify-between">
            <div><span class="text-current/50">Bet</span> $1.00 <span class="text-current/50">with</span> <Xnumbers value={item.x_numbers+"*"+item.count}/> <span class="text-current/50">on</span> Round-{item.round} <Show when={item.mining}><Icon icon="iconoir:arrow-right" class="text-current/50"/> {toBalanceValue(item.mining?.[0],item.mining?.[2],2)} <Ticker class="text-current/50">{item?.mining?.[1]}</Ticker></Show></div>
            <div><Moment ts={Number(item.created)}/></div>
          </div>
        </div>}
      </For>
      <Show when={hasMore()}>
        <Loadmore loadMore={loadMore} loading={loadingMore()}/>
      </Show>
    </section>
  )
}