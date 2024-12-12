import { createDividends } from "../../signals/alt"
import { agent,pool } from "../../signals/global"
import { createEffect, For } from "solid-js"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Datetime } from "../../components/moment"
import { app } from "../../signals/global"
import { Icon } from "@iconify-icon/solid"

export default props => {
  const [dividends,{hasMore,loadingMore}] = createDividends(()=>({pool_id:pool.id,agent_id:agent.id}))

  createEffect(()=>console.log(dividends()))
  
  return(
    <div class="py-8">
      <For each={dividends()} fallback={"no dividends"}>
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