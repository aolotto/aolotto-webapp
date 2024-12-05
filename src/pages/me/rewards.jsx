import { createUserRewards } from "../../signals/player"
import { connected,address } from "../../components/arwallet"
import { pool } from "../../signals/global"
import { createEffect, Match, Show, Switch } from "solid-js"
import { Xnumbers } from "../../components/xnumber"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Moment } from "../../components/moment"
import { Icon } from "@iconify-icon/solid"
import Ticker from "../../components/ticker"
import { app } from "../../signals/global"
import tooltip from "../../components/tooltip"
import Loadmore from "../../components/loadmore"

export default props => {
  const [rewards,{hasMore,loadingMore,loadMore}] = createUserRewards(()=>connected()&&{player_id:address(),pool_id:pool.id})
  createEffect(()=>console.log(rewards()))
  return(
    <section 
      class=" py-10 flex flex-col gap-4 "
      classList={props?.classList}
    >
      <For each={rewards()} fallback="no rewards">
        {(item,index)=><div class="response_cols p-2 hover:bg-current/5 gap-y-1 border-b border-current/10 lg:border-none rounded-md">
          <div class="col-span-full lg:col-span-3 flex gap-2 items-center">
            <span>✌️</span>
            <span class="text-current/50" use:tooltip={["top",item.id]}>{shortStr(item.id,8)}</span>
          </div>
       
          <div class="col-span-full lg:col-span-4 flex items-center gap-2">
            <span class="text-current/50">Won</span> 
            <span>{toBalanceValue(item?.prize, item.denomination||6,2)}</span>
            <span class="text-current/50">${item?.ticker}</span>
            <span class="text-current/50">in Round {item?.round}</span>

          </div>
          <div class="col-span-full lg:col-span-2 flex items-center gap-2">
            <span class="text-current/50">Taxed</span>
            <span>{toBalanceValue(item?.tax, item.denomination||6,2)}</span>
            <span class="text-current/50">${item?.ticker}</span>
          </div>
          <div class="col-span-full lg:col-span-3 flex items-center justify-end">
  
            <div class="flex items-center gap-4">
              <span class="text-current/50"><Moment ts={Number(item.created)}/></span>
              <a href={`${app.ao_link_url}/#/message/${item?.id}`} target="_blank"><Icon icon="ei:external-link"></Icon></a>
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