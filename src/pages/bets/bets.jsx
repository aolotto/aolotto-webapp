import Avatar from "../../components/avatar"
import { Xnumbers } from "../../components/xnumber"
import Ticker from "../../components/ticker"
import { Icon } from "@iconify-icon/solid"
import { ErrorBoundary, For, Match, Show, Suspense, Switch, createEffect, createMemo, useTransition, onMount, createSignal } from "solid-js"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Moment } from "../../components/moment"
import Spinner from "../../components/spinner"
// import { bets,hasMore,loadMore,loadingMore,refetchBets } from "../../signals/pool"
import Loadmore from "../../components/loadmore"
import { setDictionarys,t } from "../../i18n"
import Empty from "../../components/empty"
import Detail from "../../components/bet_detail"
// import PrizeDetail from "../../components/prize_detail"
import { fetchActiveBets } from "../../api/pool"
import { createPagination } from "../../lib/page"
import { protocols } from "../../data/info"



const ErrorAlert = (err,reset)=>{
  return(
    <div role="alert" className="alert alert-error alert-vertical sm:alert-horizontal alert-outline">
      <span>⚠️</span>
      <span>{err.message}</span>
      <button className="btn" onClick={reset}>Try again</button>
    </div>
  )
}


export default props => {
  let _detail
  
  setDictionarys("en",{
    "t.win_rate" : "The last bettor has a higher chance to win since they get 100% of the jackpot if no bets match.",
    "t.no_bets" : "No bets yet, earlier bets mint more.",
    "t.win_rate2" : (v)=><span>If no more bets, {v.last_bettor_rate}% <b>(🍕~${v.last_bettor_amount})</b> of the jackpot goes to the last bettor, {v.winner_rate}% to the winners.</span>,
    "details" : "details",
    "tooltip.gap_reward": (v)=><span>Since no new bets were placed after this bet for a while, the protocol distributed <b>{v.count}</b> Gap-Rewards to the bettor (one every 10 minutes), totaling <b>{v.amount}</b> $ALT.</span>,
    "tooltip.first_gap_reward": (v)=><span>The {v.count>1?"next":"first"} Gap-Reward is expected to be received at {v.time} if no new bets are added in time. After the time, refresh the list to check!</span>,
    "th.player" : "Player",
    "th.number" : "Number",
    "th.date" : "Date"
  })
  setDictionarys("zh",{
    "t.win_rate" : "最後下注的赢率更大，开奖若无中奖投注的情况下，奖金100%由最后下注者一人所得。",
    "t.no_bets" : "暫無投注,越早投注鑄幣奖励越高.",
    "t.win_rate2" : (v)=><span>若无投注追加, 大奖的{v.last_bettor_rate}% <b>(🍕~${v.last_bettor_amount})</b> 奖励最后下注者, {v.winner_rate}% 为赢家所得.</span>,
    "tooltip.gap_reward": (v)=><span>这笔投注之后的一段时间内无新投注追加，协议向投注者下发了<b>{v.count}</b>次空当奖励(Gap-Reward)，共计<b>{v.amount}</b>$ALT.</span>,
    "tooltip.first_gap_reward": (v)=><span>如果没有新的投注追加,{v.count>1?"下一笔":"第一笔"}空当奖励（Gap-Reward）将于{v.time}下发，超出时间后建议刷新列表检查。</span>,
    "details" : "详情",
    "th.player" : "玩家",
    "th.number" : "号码",
    "th.date" : "日期"
  })
  const [isPending,startTransation] = useTransition()
  const [bets,{hasMore,loadMore,refetch:refetchBets,loadingMore}] = createPagination(()=>props?.state&&protocols?.pool_id, fetchActiveBets ,{size:100})
  const reached_target = createMemo(()=>props?.state?.bet?.[1]>=props?.state?.wager_limit)
  const lastreward = createMemo(()=>props?.state?.jackpot * (1-props?.state?.bet?.[1]/props?.state?.wager_limit))
  const lastreward_rate = createMemo(()=>Math.max(1-props?.state?.bet?.[1]/props?.state?.wager_limit,0.01)*100)
  const winreward_rate = createMemo(()=>(props?.state?.bet?.[1]/props?.state?.wager_limit)*100)



  onMount(()=>{
    props?.ref({
      refetch : ()=>startTransation(refetchBets)
    })
  })

  return(
    <section 
      class="border-t border-current/20 py-10 flex flex-col gap-4 "
      classList={{
        "opacity-20":isPending(),
        "opacity-100":!isPending()
      }}
    >
      <ErrorBoundary fallback={ErrorAlert}>
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
              <Match when={!props?.update}>
                <div class="w-full flex justify-center items-center h-10 pb-4 text-sm gap-2">
                  <span className=" animate-bounce inline-flex items-center justify-center">👇</span> 
                  <Show when={!reached_target()} fallback={
                    <span>
                      {t("t.win_rate")}
                    </span>}>
                    <span>
                    {t("t.win_rate2",{
                      last_bettor_rate: lastreward_rate().toFixed(2),
                      last_bettor_amount: toBalanceValue(lastreward()||0,6,2),
                      winner_rate: winreward_rate().toFixed(2)
                    })}
                    </span>
                  </Show>
                  
                  <button className="btn btn-link p-0" onClick={()=>{
                    if(props?.onClickJackpotPie){
                      props.onClickJackpotPie()
                    }
                  }}>{t("details")}</button>
                </div>
              </Match>
            </Switch>
          </Show>
        <div className="overflow-visible">
          <table className="response_table w-full">
            <Show when={bets()?.length>0}>
              <thead>
                <tr className="text-sm text-current/50">
                    <th>{t("th.player")}</th>
                    <th>{t("th.number")}</th>
                    <th>Bet2Mint</th>
                    <th class="text-right">{t("th.date")}</th>
                    <th></th>
                  </tr>
              </thead>
            </Show>
              
              <tbody>
              <For each={bets()}>{(item,index)=>{
                return(
                <tr className="hover:bg-base-200">
                  <td data-label={t("th.player")} className=" font-normal text-left overflow-visible ">
                    <div className="flex items-center gap-4">
                    <Avatar username={item?.player} class="size-7"/>
                    <div class="lg:tooltip tooltip-right">
                      <div className="tooltip-content overflow-x-auto"><span class="inline-flex text-xs w-fit whitespace-nowrap">{item.player}</span></div>
                        <span class="text-current/50 flex gap-2 item-center" >
                          <span>{shortStr(item.player||"",6)}</span>
                        </span>
                    </div>
                    </div>
                    
                  </td>
                  <td data-label={t("th.number")} className="items-center"><Xnumbers value={item?.x_numbers+"*"+item.count} onClick={props?.onXNumberClick}/> </td>
                  <td data-label="Bet2Mint" className="flex items-center justify-between min-w-[320px]">
                    <div className="flex items-center gap-2">
                    <b>${toBalanceValue(item?.amount,item?.denomination||6)}</b> <Icon icon="iconoir:arrow-right" class="text-current/50"></Icon> <span>{toBalanceValue(item.mint.total,item.mint.denomination,12)}</span> <span className="text-current/50">$ALT</span>
                    </div>
                    <div class="px-4 flex items-center gap-4">
                      <Show when={index()==0}>
                        <div class="lg:tooltip">
                            <div class="tooltip-content">
                              <p class="text-left p-2">
                                {t("tooltip.first_gap_reward",
                                    {time: new Date(item?.created+(600000*(item?.mint?.plus?.[1]||1))).toLocaleTimeString(),count: item?.mint?.plus?.[1]?(item?.mint?.plus?.[1]):1}
                                  )}
                              </p>
                            </div>
                            <Icon icon="eos-icons:hourglass" />
                          </div>
                        </Show>
                        <Show when={item?.mint?.plus}>
                          <div 
                            class="text-sm px-2 py-1 rounded-full cursor-pointer lg:tooltip"
                          >
                            <div class="tooltip-content">
                              <p class="text-left p-2">{t("tooltip.gap_reward",{count:item?.mint?.plus?.[1],amount:toBalanceValue(item?.mint?.plus?.[0],item?.mint?.denomination||12,12)})}</p>
                            </div>
                            +{toBalanceValue(item?.mint?.plus?.[0],item?.mint?.denomination||12,12)} <span className="text-current/50">$ALT</span>
                          </div>
                        </Show>

                      </div>
                  </td>
                  
                  <td data-label={t("th.date")} className="text-right text-current/50">
                    <Moment ts={item.created}/>
                  </td>
                  <td className="text-right size-4">
                    <button 
                      className="flex items-center justify-center text-primary p-1 tooltip cursor-pointer" 
                      data-tip="Betting Details"
                      onClick={()=>_detail?.open(item)}
                    >
                      <Icon icon="hugeicons:square-arrow-expand-01" />
                    </button>
                  </td>
                </tr>
                )
              }}</For>
              </tbody>
            </table>
        </div>
         
          <Show when={hasMore()}>
            <Loadmore loadMore={loadMore} loading={loadingMore()}/>
          </Show>
          <Show when={!bets.loading && bets()?.length <= 0}>empty</Show>
        </Suspense>
      </ErrorBoundary>
      <Detail ref={_detail}/>
    </section>
  )
}