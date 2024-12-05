import { createMinings } from "../../signals/lotto"
import { agent,pool } from "../../signals/global"
import { createEffect, For, Show,createRoot } from "solid-js"
import Loadmore from "../../components/loadmore"
import Avatar from "../../components/avatar"
import { toBalanceValue,shortStr } from "../../lib/tool"
import { Datetime } from "../../components/moment"
import { Icon } from "@iconify-icon/solid"
import { app } from "../../signals/global"

export default props => {

  const [minings,{loadMore,loadingMore,hasMore}] = createMinings(()=>({agent_id:agent.id,pool_id:pool.id}))

  return(
    <div class="py-8">
      <For each={minings()} fallback={"no minings"}>
        {(item)=>(
          <div class="response_cols p-2 hover:bg-current/5 gap-y-1 border-b border-current/10 lg:border-none rounded-md ">
            <div class="flex items-center gap-4 col-span-full lg:col-span-4">
              <Avatar username={item.address} class="size-7"/>
              <div><span class="text-current/50">{shortStr(item.address||"",8)}</span></div>
            </div>
            <div class="flex justify-end gap-2 items-center col-span-full lg:col-span-4"><span>{toBalanceValue(item.amount,12,2)}</span> <span class="text-current/50">${item.ticker}</span></div>
            <div class=" gap-4 col-span-full lg:col-span-4 flex items-center justify-end">
              <span class="text-current/50 "><Datetime ts={item.timestamp*1000}/></span>
              <a href={`${app.ao_link_url}/#/message/${item?.id}`} target="_blank"><Icon icon="ei:external-link"></Icon></a>
            </div>
          </div>
        )
          }
      </For>
      <Show when={hasMore()}>
        <Loadmore loadMore={loadMore} loading={loadingMore()}/>
      </Show>
    
    </div>
  )
}