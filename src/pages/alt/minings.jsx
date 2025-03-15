import { createMinings } from "../../data/store"
import { createEffect, For, Show,createRoot } from "solid-js"
import Loadmore from "../../components/loadmore"
import Avatar from "../../components/avatar"
import { toBalanceValue,shortStr } from "../../lib/tool"
import { Datetime } from "../../components/moment"
import { Icon } from "@iconify-icon/solid"
import { app,protocols } from "../../data/info"
import Empty from "../../components/empty"
import { setDictionarys,t } from "../../i18n"
import { stats } from "../../data/resouces"



export default props => {

  const agent_i= protocols?.details?.[protocols?.agent_id]

  const [minings,{loadMore,loadingMore,hasMore}] = createMinings(()=>({agent_id:protocols?.agent_id,pool_id:protocols.pool_id}))
  setDictionarys("en",{ 
    "m.desc": (v)=> <span><span class="text-base-content">{v?.amount||"..."} </span>${v.ticker} were minted via Bet2Mint, with {v?.tax || "0"} collected as tax by <a href={v?.link} target="_blank" class="inline-flex items-center text-base-content">{v?.text} <Icon icon="ei:external-link"></Icon></a>.</span>,
    "m.item_desc": (v)=> <span class="text-current/50">Minted <span class="text-base-content">{v?.amount||"..."} </span>$ALT with tax {v?.tax||"0"}</span>
  })
  setDictionarys("zh",{
    "m.desc": (v)=> <span>通過Bet2Mint鑄造了<span class="text-base-content">{v?.amount||"..."} </span>$ALT，其中{v?.tax || "0"}枚铸币税由<a href={v?.link} target="_blank" class="inline-flex items-center text-base-content">{v?.text} <Icon icon="ei:external-link"></Icon></a>征收。</span>,
    "m.item_desc": (v)=> <span class="text-current/50">鑄造 <span class="text-base-content">{v?.amount||"..."} </span>$ALT 纳税 {v?.tax||"0"}</span>
  })
  // const agent_i = protocols?.details?.[protocols?.agent_id]

  createEffect(()=>console.log(stats()))

  return(
    <div class="flex flex-col gap-8 py-8">
      <div class="w-full items-center flex justify-center text-current/50 text-sm">
      <Show when={minings()?.length > 0}>
        {t("m.desc",{
          link:"https://aolotto.org",
          text:"AolottoFoundation",
          ticker: agent_i?.Ticker || "ALT",
          amount:stats()?.total_minted_amount?toBalanceValue(stats()?.total_minted_amount,12,2):0,tax:stats()?.total_minted_amount?toBalanceValue(stats()?.total_minted_amount * 0.2,12,2):0
        })}
      </Show>
      </div>
      <div class="flex flex-col gap-2">
        <For each={minings()} fallback={<Empty tips="No mintings yet."/>}>
          {(item)=>(
            <div class="response_cols p-2 hover:bg-current/5 gap-y-1 border-b border-current/10 lg:border-none rounded-md overflow-visible">
              <div class="flex items-center gap-4 col-span-full lg:col-span-4">
                <Avatar username={item.address} class="size-7"/>
                <div><span class="text-current/50">{shortStr(item.address||"",8)}</span></div>
              </div>
              <div class="flex gap-2 items-center col-span-full lg:col-span-4">
                {t("m.item_desc",{amount:toBalanceValue(item.amount,12,2),tax:toBalanceValue(item.total - item.amount,12,2)})}
                {/* <span class="text-current/50">Mint  </span>
                <span>{toBalanceValue(item.total,12,2)}</span>
                <span class="text-current/50">${item.ticker} with tax {toBalanceValue(item.total - item.amount,12,2)}</span> */}
              </div>
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
      
    
    </div>
  )
}