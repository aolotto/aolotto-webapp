import { createUserClaims } from "../../signals/player"
import { connected,address } from "../../components/arwallet"
import { app ,protocols } from "../../signals/global"
import { createEffect, Match, Show, Switch } from "solid-js"
import { Xnumbers } from "../../components/xnumber"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Moment } from "../../components/moment"
import { Icon } from "@iconify-icon/solid"
import Ticker from "../../components/ticker"
import Loadmore from "../../components/loadmore"
import tooltip from "../../components/tooltip"
import  Empty from "../../components/empty"
import { setDictionarys,t } from "../../i18n"

export default props => {
  setDictionarys("en",{
    "claimed": "Claimed",
    "c.tips": (v)=><span class="text-current/50">, Received <span class="text-base-content">${v?.receive}</span> after a <span class="text-base-content">${v?.tax}</span> tax</span>,
    "processing": "Processing"
  })
  setDictionarys("zh",{
    "claimed": "已領取",
    "c.tips": (v)=><span class="text-current/50">，扣除<span class="text-base-content"> ${v?.tax} </span>稅收后實得<span class="text-base-content"> ${v?.receive} </span></span>,
    "processing": "處理中"
  })
  const [claims,{hasMore,loadMore,loadingMore}] = createUserClaims(()=>connected()&&{player_id:address(),pool_id:protocols?.pool_id,agent_id:protocols?.agent_id,token_id:protocols?.pay_id})
  createEffect(()=>console.log(claims()))
  return(
    <section 
      class=" py-10 flex flex-col gap-4 "
      classList={props?.classList}
    >
      <For each={claims()} fallback={<Empty tips="No claims yet"/>}>
        {(item,index)=><div class="response_cols p-2 hover:bg-current/5 gap-y-1 border-b border-current/10 lg:border-none rounded-md">
          <div class="col-span-full lg:col-span-3">
          🏆 <span class="text-current/50">{shortStr(item.id,8)}</span>
          </div>
          <div class="col-span-full lg:col-span-9 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-current/50">{t("claimed")}</span> 
              <span>${toBalanceValue(item.amount,item?.denomination||6,2)}</span>
              
              {t("c.tips",{
                receive: toBalanceValue(item.quantity,item?.denomination||6,2),
                tax: toBalanceValue(item.tax,item?.denomination||6,2)
              })}
            </div>
            <div class="flex items-center gap-4">
              <span class="text-current/50">{item.timestamp?<Moment ts={Number(item.timestamp*1000)}/>:t("processing")}</span>
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