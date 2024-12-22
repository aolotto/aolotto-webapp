import Avatar from "../../components/avatar"
import { Xnumbers } from "../../components/xnumber"
import Ticker from "../../components/ticker"
import { Icon } from "@iconify-icon/solid"
import { For, Match, Show, Suspense, Switch, createEffect, createMemo } from "solid-js"
import { shortStr, toBalanceValue } from "../../lib/tool"
import tooltip from "../../components/tooltip"
import { Moment } from "../../components/moment"
import { app } from "../../signals/global"
import Spinner from "../../components/spinner"
import { bets,hasMore,loadMore,loadingMore } from "../../signals/pool"
import Loadmore from "../../components/loadmore"
import { setDictionarys,t } from "../../i18n"
import Empty from "../../components/empty"


const BetItem = props => {
  const item = () => props.value
  // const token_bet = createMemo(()=>item()?.currency.split(","))
  const mined = createMemo(()=>item()?.mint)
  const sponsor = createMemo(()=>item()?.sponsor?.split(","))
  setDictionarys("en",{
    "i.bet" : "Bet",
    "i.mint" : "Mint"
  })
  setDictionarys("zh",{
    "i.bet" : "下注",
    "i.mint" : "鑄幣"
  })

  return (
    
    <div class="response_cols p-1 hover:bg-current/5 gap-y-1 border-b border-current/10 lg:border-none">
        <div class="col-span-full lg:col-span-3">
          <div class="flex items-center gap-4">
            <Avatar username={item()?.player} class="size-7"/>
            <span class="text-current/50" use:tooltip={['top',()=>item()?.player]}>
              <Show when={item()?.player} fallback="-">{shortStr(item().player||"",6)}</Show>
            </span>
          </div>
        </div>

        <div class="col-span-full lg:col-span-6 flex items-center gap-4">
          <Xnumbers value={item()?.x_numbers+"*"+item().count} onClick={props?.onXNumberClick}/> 
          <div class="inline-flex gap-1">
            <span class="text-current/50">{t("i.bet")}</span>
            <span>${toBalanceValue(item()?.amount,item()?.denomination||6,1)}</span>
            {/* <Ticker class="text-current/50">{item()?.ticker}</Ticker> */}
          </div>
          <Switch>
            <Match when={item()?.sponsor} >
              <div class="inline-flex items-center gap-2">
                <span>🎁</span><span class="text-sm"><span class="text-current/50">Sponsored by</span> <a href={sponsor()?.[3]} target="_blank" class="bg-primary/20 text-primary inline-flex px-2 py-0.5 rounded-md text-xs items-center gap-1">{sponsor()?.[1]}</a></span>
              </div>
            </Match>
            <Match when={!item()?.sponsor}>
              <Show when={item()?.mint}>
                <div class="inline-flex items-center gap-2">
                  <Icon icon="iconoir:arrow-right" class="text-current/50"></Icon>
                  <span class="text-current/50">{t("i.mint")}</span>
                  <span>{toBalanceValue(mined().total,mined().denomination||12,2)}</span> 
                  <Ticker class="text-current/50">{mined().ticker}</Ticker>
                </div>
              </Show>
            </Match>
          </Switch>
          

        </div>
  
        <div class="col-span-full lg:col-span-3 flex justify-between items-center">
          <span class="text-current/50">
          <Moment ts={item()?.created}/>
          </span>
          <a href={`${app.ao_link_url}/#/entity/${item()?.id}?tab=linked`} target="_blank">
            <Icon icon="ei:external-link"></Icon>
          </a>
        </div>
    </div>
  )
}

export default props => {
  setDictionarys("en",{
    "t.win_rate" : "👇 The last bettor below gets at least a 50% higher chance to win. Bet now to take the spot!",
    "t.no_bets" : "No bets yet,earlier bets mint more."
  })
  setDictionarys("zh",{
    "t.win_rate" : "👇 下面最後下注玩家的贏獎機率至少高出50%，立即下注替代TA!",
    "t.no_bets" : "暫無投注,越早投注鑄幣額越高"
  })
  return(
    <section 
      class="border-t border-current/20 py-10 flex flex-col gap-4 "
      classList={props?.classList}
    >
      <Suspense fallback={<Spinner/>}>
        <div class="w-full flex justify-center items-center h-10 pb-4 text-sm">{t("t.win_rate")}</div>
        <For each={bets()} fallback={<Empty tips={t("t.no_bets")}/>}>
          {(item)=>{
            return <BetItem value={item} onXNumberClick={props?.onXNumberClick}/>
          }}
        </For>
        <Show when={hasMore()}>
          <Loadmore loadMore={loadMore} loading={loadingMore()}/>
        </Show>
      </Suspense>
    </section>
  )
}