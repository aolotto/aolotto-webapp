import { createDividends } from "../../data/store"
import { protocols } from "../../data/info"
import { createEffect, For } from "solid-js"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Datetime } from "../../components/moment"
import { app } from "../../data/info"
import { Icon } from "@iconify-icon/solid"
import Empty from "../../components/empty"
import { stats } from "../../data/resouces"
import { setDictionarys,t } from "../../i18n"
import Loadmore from "../../components/loadmore"

export default props => {
  const [dividends,{hasMore,loadingMore}] = createDividends(()=>({pool_id:protocols?.pool_id,agent_id:protocols?.agent_id}))
  setDictionarys("en",{
    "div.tips": (v)=> <span>A total of <span class="text-base-content">${v.paid}</span> in dividends has been distributed, with <span class="text-base-content">${v.unpaid}</span> remaining.</span>,
    "div.distributed": "Distributed",
    "div.to": "to",
    "div.holders": "Holders"
  })
  setDictionarys("zh",{
    "div.tips": (v)=> <span>累计已分发<span class="text-base-content">${v.paid}</span>的分红，还有<span class="text-base-content">${v.unpaid}</span>待分发。</span>,
    "div.distributed": "分发",
    "div.to": "给",
    "div.holders": "持有者"
  })

  createEffect(()=>console.log(dividends()))
  
  return(
    <div class="flex flex-col gap-8 py-8">
      <Show when={dividends()?.length > 0}>
        <div class="w-full items-center flex justify-center text-current/50 text-sm">
        {t("div.tips",{paid:toBalanceValue(stats()?.dividends?.[2],6,2),unpaid:toBalanceValue(stats()?.dividends?.[0],6,2)})}
        </div>
      </Show>
      
      <For each={dividends()} fallback={<Empty tips="no records yet"/>}>
        {(item)=>(
          <div class="response_cols p-2 hover:bg-current/5 gap-y-1 border-b border-current/10 lg:border-none rounded-md ">
            <div class="flex items-center gap-4 col-span-full lg:col-span-4">
            <span class="size-7 inline-flex items-center justify-center rounded-full border text-[#68E2B9]"><Icon icon="iconoir:send-dollars" /> </span> 
            <span class="text-current/50">{shortStr(item.id,8)}</span>
            </div>
            <div class="flex items-center gap-2 col-span-full lg:col-span-5">
              <span class="text-current/50">{t("div.distributed")} </span>
              <span>${toBalanceValue(item?.amount,6,2)} </span>
              <span class="text-current/50">{t("div.to")}</span>
              <span>{item?.addresses}</span>
              <span class="text-current/50">{t("div.holders")}</span>
            </div>
            <div class="flex items-center justify-end gap-2 col-span-full lg:col-span-3">
              <span class="text-current/50 "><Datetime ts={item.timestamp*1000}/></span>
              <a href={`${app.ao_link_url}/#/message/${item?.id}`} target="_blank"><Icon icon="ei:external-link"></Icon></a>
            </div>
          </div>
        )}
      </For>
      <Show when={hasMore()}>
        <Loadmore loadMore={loadMore} loading={loadingMore()}/>
      </Show>
    </div>
  )
}