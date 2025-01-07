import { createUserMintings } from "../../signals/player"
import { connected,address } from "../../components/wallet"
import { app,protocols } from "../../signals/global"
import { createEffect, Match, Show, Switch } from "solid-js"
import { Xnumbers } from "../../components/xnumber"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Datetime, Moment } from "../../components/moment"
import { Icon } from "@iconify-icon/solid"
import Ticker from "../../components/ticker"
import Loadmore from "../../components/loadmore"
import tooltip from "../../components/tooltip"
import Empty from "../../components/empty"
import { setDictionarys,t } from "../../i18n"
import { tippy, useTippy } from 'solid-tippy';


export default props => {
  const agent_i = protocols?.details[protocols.agent_id]
  const [mintings,{hasMore,loadMore,loadingMore}] = createUserMintings(()=>connected()&&{player_id:address(),pool_id:protocols?.pool_id,agent_id:protocols?.agent_id})
  createEffect(()=>console.log("mintings",mintings()))
  setDictionarys("en",{
    "minted":"Minted",
    "received":"Received",
  })
  setDictionarys("zh",{
    "minted":"铸造",
    "received":"到账",
  })
  return(
    <section 
      class=" py-10 flex flex-col gap-4 "
      classList={props?.classList}
    >
      <For each={mintings()} fallback={<Empty tips="No bets yet"/>}>
        {(item,index)=><div class="response_cols p-2 hover:bg-current/5 gap-y-1 border-b border-current/10 lg:border-none rounded-md">
          <div class="col-span-full lg:col-span-3 flex items-center gap-2">
            <span>🪙</span> 
           <span class="text-current/50" use:tooltip={["top",item?.id]}>{shortStr(item?.id,8)}</span>
          </div>
          {/* <div class="col-span-full lg:col-span-1 flex items-center gap-2">
            <div></div>
          </div> */}
          <div class="col-span-full lg:col-span-9 flex items-center justify-between">
            
            
            <div class="flex items-center gap-4">
              {item?.type=="Save-Ticket"?
                <span 
                  class="text-xs bg-primary text-primary-content px-2 py-1 rounded-xs uppercase"
                  use:tippy={{
                    allowHTML: true,
                    hidden: true,
                    animation: 'fade',
                    props: {
                      content : ()=><div class="tipy">Rewards from betting.</div> 
                    }
                  }}
                >
                  bet-2-mint
                </span>
                :
                <span 
                  class="text-xs bg-third text-third-content px-2 py-1 uppercase rounded-sm"
                  use:tippy={{
                    allowHTML: true,
                    hidden: true,
                    animation: 'fade',
                    props: {
                      content : ()=><div class="tipy">The Gap-Reward is issued by the protocol to the last bettor every 10 minutes if no new bets are added. This reward comes from the bet: {shortStr(item?.bet_id,6)}   </div> 
                    }
                  }}
                >
                    Gap-Reward
                  </span>}
              <span class="text-current/50 flex items-center gap-2">{t("minted")} 
              <span 
                class="text-base-content" 
                use:tippy={{
                    allowHTML: true,
                    hidden: true,
                    animation: 'fade',
                    props: {
                      content : ()=><div class="tipy">{toBalanceValue(item.total,agent_i?.Denomination||12,12)}</div> 
                    }
                  }}
                >
                    {toBalanceValue(item.total,agent_i?.Denomination||12,6)}
                  </span> , {t("received")} 
              <span 
                class="text-base-content"
                use:tippy={{
                  allowHTML: true,
                  hidden: true,
                  animation: 'fade',
                  props: {
                    content : ()=><div class="tipy">{toBalanceValue(item.amount,agent_i?.Denomination||12,12)}</div> 
                  }
                }}
              >
                {toBalanceValue(item.amount,agent_i?.Denomination||12,6)}
              </span> $ALT</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-current/50"><Datetime ts={item?.mint_time? Number(item?.mint_time):Number(item?.timestamp * 1000)}/></span>
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