import { createUserTickets } from "../../signals/player"
import { connected,address } from "../../components/wallet"
import { app,protocols } from "../../signals/global"
import { createEffect, Match, Show, Switch } from "solid-js"
import { Xnumbers } from "../../components/xnumber"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Moment } from "../../components/moment"
import { Icon } from "@iconify-icon/solid"
import Ticker from "../../components/ticker"
import Loadmore from "../../components/loadmore"
import tooltip from "../../components/tooltip"
import Empty from "../../components/empty"
import { setDictionarys,t } from "../../i18n"

export default props => {
  setDictionarys("en",{
    "bet.item_desc" : (v)=><span class="text-current/50">Bet <span class="text-base-content">${v.amount}</span> on Round-<span class="text-base-content">{v.round}</span>  </span>,
  })
  setDictionarys("zh",{
    "bet.item_desc" : (v)=><span class="text-current/50">投注 <span class="text-base-content">${v.amount}</span> 到第<span class="text-base-content">{v.round}</span>轮 </span>
  })
  const [tickets,{hasMore,loadMore,loadingMore}] = createUserTickets(()=>connected()&&{player_id:address(),pool_id:protocols?.pool_id})

  return(
    <section 
      class=" py-10 flex flex-col gap-4 "
      classList={props?.classList}
    >
      <For each={tickets()} fallback={<Empty tips="No bets yet"/>}>
        {(item,index)=><div class="response_cols p-2 hover:bg-current/5 gap-y-1 border-b border-current/10 lg:border-none rounded-md">
          <div class="col-span-full lg:col-span-3 flex items-center gap-2">
          <span>🎲</span> 
          <span class="text-current/50" use:tooltip={["top",item?.id]}>{shortStr(item?.id,8)}</span>
          </div>
          <div class="col-span-full lg:col-span-2 flex items-center justify-end">
          <Xnumbers value={item.x_numbers+"*"+item.count}/> 
          </div>
          <div class="col-span-full lg:col-span-7 flex items-center justify-between">
            <div>
              
              {t("bet.item_desc",{
                amount: toBalanceValue(item?.amount,item?.denomination||6,2),
                round: item?.round
              })}
              
            </div>
            <div class="flex items-center gap-4">
              <span class="text-current/50"><Moment ts={Number(item?.created)}/></span>
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