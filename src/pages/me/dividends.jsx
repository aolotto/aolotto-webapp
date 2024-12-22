import { createUserDividends } from "../../signals/player"
import { connected,address } from "../../components/arwallet"
import { app ,protocols } from "../../signals/global"
import { createEffect, Match, Show, Switch } from "solid-js"
import { Xnumbers } from "../../components/xnumber"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Moment } from "../../components/moment"
import { Icon } from "@iconify-icon/solid"
import tooltip from "../../components/tooltip"
import Loadmore from "../../components/loadmore"
import Empty from "../../components/empty"

export default props => {
  const pay_i = protocols?.details[protocols.pay_id]
  const [divedends,{hasMore,loadMore,loadingMore}] = createUserDividends(()=>connected()&&{player_id:address(),pool_id:protocols?.pool_id,agent_id:protocols?.agent_id,token_id:protocols?.pay_id})
  createEffect(()=>console.log(divedends()))
  return(
    <section 
      class=" py-10 flex flex-col gap-4 "
      classList={props?.classList}
    >
      <For each={divedends()} fallback={<Empty tips="No dividends yet"/>}>
        {(item,index)=><div class="response_cols p-2 hover:bg-current/5 gap-y-1 border-b border-current/10 lg:border-none rounded-md">
          <div class="col-span-full lg:col-span-3 flex gap-2 items-center">
            <span>💰</span>
           <span class="text-current/50" use:tooltip={["top",item.id]}>{shortStr(item.id,8)}</span>
          </div>
          <div class="col-span-full lg:col-span-9 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-current/50">Received</span> 
              <span use:tooltip={["top",()=>toBalanceValue(item.quantity,pay_i?.Denomination||6,6)]}>{toBalanceValue(item.quantity,pay_i?.Denomination||6,4)}</span> 
              <span class="text-current/50">${pay_i?.Ticker}</span> 
              <span class="text-current/50" use:tooltip={["top",item.distribute_from]}>From {shortStr(item.distribute_from,6)}</span> </div>
            <div class="flex items-center gap-4">
              <span class="text-current/50"><Moment ts={Number(item.timestamp*1000)}/></span>
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