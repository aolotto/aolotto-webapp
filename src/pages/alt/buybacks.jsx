import { createBuybacks } from "../../data/store"
import { protocols } from "../../data/info"
import { createEffect, For,Show } from "solid-js"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Datetime } from "../../components/moment"
import { app } from "../../data/info"
import { Icon } from "@iconify-icon/solid"
import Empty from "../../components/empty"
import Loadmore from "../../components/loadmore"
import { stats } from "../../data/resouces"
import { setDictionarys,t } from "../../i18n"


export default props => {
  const [buybacks,{hasMore,loadingMore}] = createBuybacks(()=>({buyback_id:protocols.buybacks_id,agent_id:protocols?.agent_id}))
  
  setDictionarys("en",{
    "b.tips": (v)=> <span>A total of <span class="text-base-content">{v.burned}</span> $ALT has been bought back and burned, costing <span class="text-base-content">${v.cost}</span> .</span>
  })

  setDictionarys("zh",{
    "b.tips": (v)=> <span>累计已回购销毁<span class="text-base-content">${v.burned}</span> $ALT，花费了<span class="text-base-content">${v.cost}</span>。</span>
  })
  
  return(
    <div class="flex flex-col gap-8 py-8">
      <Show when={buybacks()?.length >= 0}>
        <div class="w-full items-center flex justify-center text-current/50 text-sm">
          {t("b.tips",{
            burned:toBalanceValue(stats()?.total_burned,12,2),
            cost:toBalanceValue(stats()?.buybacks?.[2],6,2)
          })}
        </div>
      </Show>
      
      <For each={buybacks()} fallback={<Empty tips="No buybacks yet."/>}>
        {(item)=>(
          <div class="response_cols p-2 hover:bg-current/5 gap-y-1 border-b border-current/10 lg:border-none rounded-md ">
            <div class="flex items-center gap-4 col-span-full lg:col-span-4">
            <span class="size-7 inline-flex items-center justify-center rounded-full border text-[#68E2B9]"><Icon icon="iconoir:send-dollars" /> </span> 
            <span class="text-current/50">{shortStr(item.id,8)}</span>
            </div>
            <div class="flex items-center gap-2 col-span-full lg:col-span-5">
              <span class="text-current/50">Distributed </span>
              <span>${toBalanceValue(item?.amount,6,2)} </span>
              <span class="text-current/50">to</span>
              <span>{item.count||"-"} </span>
              <span class="text-current/50">holders</span>
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