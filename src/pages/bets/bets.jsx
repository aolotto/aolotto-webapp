import Avatar from "../../components/avatar"
import { Xnumbers } from "../../components/xnumber"
import Ticker from "../../components/ticker"
import { Icon } from "@iconify-icon/solid"
import { ErrorBoundary, For, Match, Show, Suspense, Switch, createEffect, createMemo, onCleanup, onMount } from "solid-js"
import { shortStr, toBalanceValue } from "../../lib/tool"
import tooltip from "../../components/tooltip"
import { Moment } from "../../components/moment"
import { app } from "../../signals/global"
import Spinner from "../../components/spinner"
import { bets,hasMore,loadMore,loadingMore,refetchBets } from "../../signals/pool"
import Loadmore from "../../components/loadmore"
import { setDictionarys,t } from "../../i18n"
import Empty from "../../components/empty"
import { tippy } from "solid-tippy"
import { state } from "../../signals/pool"
import Gapview from "../../components/gapview"
import { player } from "../../signals/player"
import Detail from "../../components/bet_detail"




const BetItem = props => {
  const item = () => props.value
  const mined = createMemo(()=>item()?.mint)
  const sponsor = createMemo(()=>item()?.sponsor?.split(","))
  setDictionarys("en",{
    "i.bet" : "Bet",
    "i.mint" : "Mint",
    "tooltip.gap_reward": (v)=><span>Since no new bets were placed after this bet for a while, the protocol distributed <b>{v.count}</b> Gap-Rewards to the bettor (one every 10 minutes), totaling <b>{v.amount}</b> $ALT.</span>,
    "tooltip.first_gap_reward": (v)=><span>The {v.count>1?"next":"first"} Gap-Reward is expected to be received at {v.time} if no new bets are added in time. After the time, refresh the list to check!</span>,
    "i.new_tickets" : (v)=><span>{v} new ticket{v>1?"s":""}</span> 
  })
  setDictionarys("zh",{
    "i.bet" : "下注",
    "i.mint" : "鑄幣",
    "tooltip.gap_reward": (v)=><span>这笔投注之后的一段时间内无新投注追加，协议向投注者下发了<b>{v.count}</b>次空当奖励(Gap-Reward)，共计<b>{v.amount}</b>$ALT.</span>,
    "tooltip.first_gap_reward": (v)=><span>如果没有新的投注追加,{v.count>1?"下一笔":"第一笔"}空当奖励（Gap-Reward）将于{v.time}下发，超出时间后建议刷新列表检查。</span>,
    "i.new_tickets" : (v)=><span>{v} 笔新投注</span> 
  })

  return (
    
    <div class="response_cols p-1 hover:bg-current/5 gap-y-1 border border-current/0 hover:border-current/8 rounded-sm overflow-visible ">
        <div class="col-span-full lg:col-span-3 flex items-center">
          <div class="flex items-center gap-4">
            <Avatar username={item()?.player} class="size-7"/>
            <div class="lg:tooltip tooltip-right">
              <div className="tooltip-content overflow-x-auto"><span class="inline-flex text-xs w-fit whitespace-nowrap">{item()?.player}</span></div>
              <span class="text-current/50 flex gap-2 item-center" >
                
                <span>{shortStr(item().player||"",6)}</span>
                {/* <span class="text-base-content">Happy new year!!!</span> */}
              </span>
            </div>
            
          </div>
        </div>
        <div class="col-span-full lg:col-span-1 flex items-center">
        <Xnumbers value={item()?.x_numbers+"*"+item().count} onClick={props?.onXNumberClick}/> 
        </div>
        <div class="col-span-full lg:col-span-6">
        
          <div class=" flex items-center gap-4 justify-between h-full">
          <div class="flex items-center gap-2">
            <div class="inline-flex gap-2">
              <span class="text-current/50">{t("i.bet")}</span>
              <b>${toBalanceValue(item()?.amount,item()?.denomination||6)}</b>
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
                      <div class="lg:tooltip" data-tip={toBalanceValue(mined().total,mined().denomination||12,12)}>
                        <span>{toBalanceValue(mined().total,mined().denomination||12,6)}</span>
                      </div>
                    <Ticker class="text-current/50">{mined().ticker}</Ticker>
                  </div>
                </Show>
              </Match>
            </Switch>
            </div>
            <div class="px-4 flex items-center gap-4">
            <Show when={props?.first}>
              <div class="lg:tooltip">
                  <div class="tooltip-content">
                    <p class="text-left p-2">
                      {t("tooltip.first_gap_reward",
                          {time: new Date(item()?.created+(600000*(mined()?.plus?.[1]||1))).toLocaleTimeString(),count:mined()?.plus?.[1]?(mined()?.plus?.[1]):1}
                        )}
                    </p>
                  </div>
                  <Icon icon="eos-icons:hourglass" />
                </div>
              </Show>
            <Show when={mined()?.plus}>
                    
                    <div 
                      class="border text-xs px-2 py-1 rounded-full cursor-pointer lg:tooltip"
                      onClick={props?.onGapRewardClick}
                    >
                      <div class="tooltip-content">
                        <p class="text-left p-2">{t("tooltip.gap_reward",{count:mined()?.plus?.[1],amount:toBalanceValue(mined()?.plus?.[0],mined().denomination||12,12)})}</p>
                      </div>
                      +{mined()?.plus?.[1]}
                    </div>
                  </Show>

                  
            </div>
          </div>
          
          
        </div>
  
        <div class="col-span-full lg:col-span-2 flex justify-between items-center gap-2">
          <span class="text-current/50">
            <Moment ts={item()?.created}/>
          </span>
          <button 
            className="flex items-center justify-center text-primary p-1 tooltip cursor-pointer" 
            data-tip="Betting Details"
            onClick={props?.onDetailClick}
          >
              <Icon icon="hugeicons:square-arrow-expand-01" />
          </button>

        </div>

    </div>
  )
}

export default props => {
  let _gap
  let _detail
  setDictionarys("en",{
    "t.win_rate" : "👇 The last bettor will get at least a 50% better odds of winning. Bet now to secure the spot!",
    "t.no_bets" : "No bets yet, earlier bets mint more."
  })
  setDictionarys("zh",{
    "t.win_rate" : "👇 最後下注玩家的贏獎機率至少高出50%，立即下注替代TA!",
    "t.no_bets" : "暫無投注,越早投注鑄幣奖励越高."
  })

  return(
    <section 
      class="border-t border-current/20 py-10 flex flex-col gap-4 "
      classList={props?.classList}
    >
      <ErrorBoundary fallback="network error">
        <Suspense fallback={<Spinner/>}>
          <Show when={bets()?.length > 0}>
            <Switch>
              <Match when={props?.update}><div class="w-full flex justify-center items-center h-10 pb-4 text-sm">
                <button 
                  className="btn btn-sm rounded-full"
                  onClick={()=>{
                    if(props?.onClickUpdate){
                      props.onClickUpdate()
                    }
                  }}
                >
                  <div className="inline-grid *:[grid-area:1/1]">
                    <div className="status status-accent animate-ping"></div>
                    <div className="status status-accent"></div>
                  </div>
                  {t("i.new_tickets",props?.update)}
                </button>
                </div>
              </Match>
              <Match when={!props?.update}><div class="w-full flex justify-center items-center h-10 pb-4 text-sm">{t("t.win_rate")}</div></Match>
            </Switch>
            
          </Show>
          
          <For each={bets()} fallback={<Empty tips={t("t.no_bets")}/>}>
            {(item,index)=>{
              return <BetItem 
                value={item} 
                onXNumberClick={props?.onXNumberClick} 
                onGapRewardClick={()=>_gap?.open({...item,index})}
                onDetailClick={()=>{
                  console.log("onDetailClick",item)
                  console.log(_detail)
                  _detail?.open(item)
                }}
                first={index()==0}
              />
            }}
          </For>
          <Show when={hasMore()}>
            <Loadmore loadMore={loadMore} loading={loadingMore()}/>
          </Show>
        </Suspense>
        <Gapview ref={_gap}/>
        <Detail ref={_detail}/>
      </ErrorBoundary>
    </section>
  )
}