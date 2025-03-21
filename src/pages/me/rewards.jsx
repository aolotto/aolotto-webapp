import { createUserRewards } from "../../data/store"
import { connected,address } from "../../components/wallet"
import { protocols } from "../../data/info"
import { createEffect, Match, Show, Switch } from "solid-js"
import { Xnumbers } from "../../components/xnumber"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Moment } from "../../components/moment"
import { Icon } from "@iconify-icon/solid"
import Ticker from "../../components/ticker"
import { app } from "../../data/info"
import tooltip from "../../components/tooltip"
import Loadmore from "../../components/loadmore"
import Empty from "../../components/empty"
import { setDictionarys,t } from "../../i18n"

export default props => {
  const [rewards,{hasMore,loadingMore,loadMore}] = createUserRewards(()=>connected()&&{player_id:address(),agent_id:protocols?.agent_id})
  setDictionarys("en",{
    "won": "Won",
    "won.tip" : (v)=><span class="text-current/50">Won Round-<span class="text-base-content">{v.round}</span>'s prize of <span class="text-base-content">${v?.prize}</span></span>
  })
  setDictionarys("zh",{
    "won": "赢取",
    "won.tip" : (v)=><span class="text-current/50">赢取第<span class="text-base-content">{v.round}</span>轮奖金 <span  class="text-base-content">${v?.prize}</span></span>
  })
  createEffect(()=>console.log(rewards()))
  return(
    <section 
      class=" py-10 flex flex-col gap-4 "
      classList={props?.classList}
    >
      <For each={rewards()} fallback={<Empty tips="No rewards yet"/>}>
        {(item,index)=><div class="response_cols p-2 hover:bg-current/5 gap-y-1 border-b border-current/10 lg:border-none rounded-md overflow-visible">
          <div class="col-span-full lg:col-span-4 flex gap-2 items-center">
            <span>✌️</span>
            <span class="text-current/50" use:tooltip={["top",item.id]}>{shortStr(item.id,8)}</span>
          </div>
       
          <div class="col-span-full lg:col-span-5 flex items-center gap-2">
            {t("won.tip",{
              round: item?.round,
              prize: toBalanceValue(item?.prize, item.denomination||6,2)
            })}
            {/* <span class="text-current/50">{t("won")}</span> 
            <span>{toBalanceValue(item?.prize, item.denomination||6,2)}</span>
            <span class="text-current/50">${item?.ticker}</span>
            <span class="text-current/50">in Round {item?.round}</span> */}

          </div>
          {/* <div class="col-span-full lg:col-span-2 flex items-center gap-2">
            <span class="text-current/50">Taxed</span>
            <span>{toBalanceValue(item?.tax, item.denomination||6,2)}</span>
            <span class="text-current/50">${item?.ticker}</span>
          </div> */}
          <div class="col-span-full lg:col-span-3 flex items-center justify-end">
  
            <div class="flex items-center gap-4">
              <span class="text-current/50"><Moment ts={Number(item.timestamp * 1000)}/></span>
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