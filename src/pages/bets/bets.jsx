import Avatar from "../../components/avatar"
import { Xnumbers } from "../../components/xnumber"
import Ticker from "../../components/ticker"
import { Icon } from "@iconify-icon/solid"
import { For, Show, Suspense, createMemo } from "solid-js"
import { shortStr, toBalanceValue } from "../../lib/tool"
import tooltip from "../../components/tooltip"
import { Moment } from "../../components/moment"
import { app } from "../../signals/global"
import Spinner from "../../components/spinner"
import { bets,hasMore,loadMore,loadingMore } from "../../signals/pool"
import Loadmore from "../../components/loadmore"

const BetItem = props => {
  const item = () => props.value
  // const token_bet = createMemo(()=>item()?.currency.split(","))
  const mined = createMemo(()=>item()?.x_mined?.split(","))
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
            <span class="text-current/50">Bet</span>
            <span>{toBalanceValue(item()?.amount,item()?.denomination||6,1)}</span>
            <Ticker class="text-current/50">{item()?.ticker}</Ticker>
          </div>
          <Show when={item()?.x_mined}>
            <div class="inline-flex items-center gap-1">
              <Icon icon="iconoir:arrow-right" class="text-current/50"></Icon>
              <span>{toBalanceValue(mined()?.[0],mined()?.[2]||12,2)}</span> 
              <Ticker class="text-current/50">{mined()?.[1]}</Ticker>
            </div>
          </Show>

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
  return(
    <section 
      class="border-t border-current/20 py-10 flex flex-col gap-4 "
      classList={props?.classList}
    >
      <Suspense fallback={<Spinner/>}>
        <For each={bets()} fallback={<div class="w-full items-center justify-center text-current/20 text-center">no bets</div>}>
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