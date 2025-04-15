import { Suspense, ErrorBoundary, createResource,Show, Switch, Match, createSignal, onMount, onCleanup,createMemo, createEffect} from "solid-js"
import { useApp } from "../../contexts"
import { Icon } from "@iconify-icon/solid"
import Spinner from "../../compontents/spinner"
import { toBalanceValue } from "../../lib/tools"
import { createSocialShare, TWITTER }  from "@solid-primitives/share";
import { setDictionarys, t } from "../../i18n"
import { Datetime } from "../../compontents/moment"
import { InfoItem } from "../../compontents/infoitem"
import Numpicker from "../../compontents/numpicker"
import { useWallet } from "arwallet-solid-kit"
import BetDetail from "../../compontents/betdetail"
import Mint from "./mint"
import Tickets from "./tickets"
import { fetchState } from "../../api"
import Errorbox from "../../compontents/errorbox"
import { storeResource } from "../../store"
import Countdown from "../../compontents/countdown"


export default props => {
  let _numpicker
  let _kbd_p_event
  let _tickets
  const { info,notify } = useApp()
  setDictionarys("en",{
    "s.start" : "Started at ",
    "b.jackpot" : "Progressive Jackpot",
    "b.balance" : "Pool Balance",
    "b.wager" : "Wager Volume",
    "b.players" : "Players",
    "b.tickets" : "Tickets",
    "b.draw_time" : "Draw Time",
    "b.countdown" : "countdown to draw",
    "b.pick_and_bet" : "Pick and bet",
    "suspended" : "Suspended",
    "b.price" : "Price",
    "b.draw_locker" : (v)=> `The draw time has been locked to ${v.time}`,
    "b.draw_tip" : ({time,wager})=><span>New bets extend the draw by <b class="text-base-content">{time}</b> hours from the time placed, until the wagers reach <b class="text-base-content">${wager}</b>. Matching bets share the jackpot; If no match, the last bettor takes all.</span>,
    "b.draw_time_est" : (v)=> <span>When the wager volume is less than the target of ${v.target}, the draw time is only estimated,as it will be extended if new bets are placed</span>,
    "b.draw_time_fixed" : (v)=> <span>The wager volume has reached the target of ${v.target}, the draw time is fixed.</span>,
    "tooltop.draw_locker" : (v)=> `The draw time has been locked to ${v.time}`,
  })
  setDictionarys("zh",{
    "s.start" : "開始於 ",
    "b.jackpot" : "累積大獎",
    "b.balance" : "獎池餘額",
    "b.wager" : "投注總額",
    "b.players" : "參與人數",
    "b.tickets" : "彩票數量",
    "b.draw_time" : "開獎時間",
    "b.countdown" : "開獎倒計時",
    "b.pick_and_bet" : "选号并下注",
    "suspended" : "暂停",
    "b.price" : "定价",
    "b.draw_locker" : (v)=> `开奖时间已锁定至${v.time}`,
    "b.draw_tip" : ({time,wager})=><span>新投注將會延長開獎時間至下注後的<b className="text-base-content">{time}</b>小時，直到累計投注量達到<b className="text-base-content">${wager}</b>；開獎後，號碼(000-999)匹配的投注共享大獎，若無投注匹配，最後下注者一人獨攬。</span>,
    "b.draw_time_est" : (v)=> <span>当投注量低于目标${v.target}时，开奖时间仅为预估, 因为一旦有新的投注追加时间将被延长</span>,
    "b.draw_time_fixed" : (v)=> <span>投注量已达到目标${v.target}，开奖时间已固定。</span>,
    "tooltop.draw_locker" : (v)=> `开奖时间已锁定至${v.time}`,
  })
  

  // const [pool,{refetch:refetchPool}] = createResource(()=>id(),fetchState)
  const [pool,{refetch:refetchPool}]  = storeResource("pool_state",()=>createResource(()=>info?.pool_process,fetchState))
  const draw_locker = createMemo(()=>{
    if(pool.state === "ready"){
      return pool()?.bet?.[1] >= pool()?.wager_limit
    }
  })

  const [shareData,setShareData] = createSignal({
    title: "Aolotto",
    url: "https://aolotto.com",
  })
  const [share, close] = createSocialShare(() => shareData());
  const {walletConnectionCheck} = useWallet()
  onMount(()=>{
    _kbd_p_event = document.addEventListener("keydown", (e)=>{
      if(e.key==="p"&&pool.state==="ready"&&pool()?.run==1&&pool()?.ts_round_start>0){
        _numpicker.open()
      }
    });
    createEffect(()=>console.log("pool=>",pool()))
  })
  onCleanup(()=>{
    document.removeEventListener("keydown",_kbd_p_event)
  })

  

  return(
  <ErrorBoundary fallback={<div className="container"><Errorbox value="Network Error"/></div>}>
    <>
    <div className="container">
      {/* round state */}
      <section className="response_cols py-2 lg:py-10 overflow-visible">
        <div className=" col-span-full lg:col-span-7">
          {/* round info top */}
          <div class="h-16 flex items-center gap-4 w-full md:w-fit justify-between md:justify-normal overflow-visible">
            <Show when={!pool.loading} fallback={<Spinner size="sm"/>}>
              <span 
                class="border-2 text-xl h-10 w-14 md:h-12 md:w-16 rounded-full inline-flex items-center justify-center tooltip"
                data-tip={"Round "+pool()?.round}
              >
                R{pool()?.round}
              </span>
            </Show>
            <span 
              class="text-current/50 uppercase text-sm">
                <Show when={!pool.loading} fallback={<div className=" skeleton w-[12em] h-[1em]"></div>}>
                  <Switch>
                    <Match when={pool()?.ts_round_start<=0}>NOT STARTED</Match>
                    <Match  when={pool()?.ts_round_start>0}>{t("s.start")} <Datetime ts={pool()?.ts_round_start} display={"date"}/></Match>
                  </Switch>
                </Show>
              </span>
      
            <button 
              className="btn btn-icon btn-ghost rounded-full btn-circle"
              onClick={()=>{
                setShareData({
                  title: `🏆$1 to win $${toBalanceValue(pool()?.jackpot,6,0)}! The last bettor gets at least a 50% better odds of WINNING on #Aolotto , ROUND-${pool()?.round} is about to draw! 👉`,
                  url: "https://aolotto.com",
                })
                share(TWITTER)
              }}
            >
              <Icon icon="iconoir:share-android"></Icon>
            </button>
          </div>
          {/* round info items for mobile */}

          <div className="flex flex-col md:hidden gap-4">
            <div className="w-full flex flex-col items-center justify-center gap-2">
              <div className="text-3xl">
                <Show when={!pool.loading} fallback={<div className="skeleton w-[6em] h-[1.2em]"></div>}>${toBalanceValue(pool()?.jackpot,6)}</Show>
              </div>
              <div className="text-sm text-current/50">{t("b.jackpot")}</div>
            </div>
            <div className=" py-4 px-2 border-y border-current/20">
              <InfoItem label={()=>t("b.balance")}  className="text-sm"><Show when={!pool.loading} fallback={<div className="skeleton w-[6em] h-[0.8em]"></div>}>${toBalanceValue(pool()?.balance,6)}</Show></InfoItem>
              <InfoItem label={()=>t("b.wager")}  className="text-sm"><Show when={!pool.loading} fallback={<div className="skeleton w-[6em] h-[0.8em]"></div>}>${toBalanceValue(pool()?.bet?.[1],6)}</Show></InfoItem>
              <InfoItem label={()=>t("b.players")}  className="text-sm"><Show when={!pool.loading} fallback={<div className="skeleton w-[3em] h-[0.8em]"></div>}>{pool()?.players}</Show></InfoItem>
              <InfoItem label={()=>t("b.tickets")}  className="text-sm"><Show when={!pool.loading} fallback={<div className="skeleton w-[3em] h-[0.8em]"></div>}>{pool()?.bet?.[2]}</Show></InfoItem>
              <InfoItem label={()=>t("b.draw_time")}  className="text-sm">
                <Show when={!pool.loading} fallback={<div className="skeleton w-[12em] h-[0.8em]"></div>}>{new Date(pool()?.ts_latest_draw).toLocaleString()}</Show>
              </InfoItem>
            </div>
          </div>

          {/* round info items for desktop */}

          <div className=" flex-col hidden md:col-span-6 lg:col-span-7 md:flex mt-4">
            <InfoItem label={()=>t("b.jackpot")} ><div className="text-3xl mb-4"><Show when={!pool.loading} fallback={<div className="skeleton w-[6em] h-[1.2em]"></div>}>${toBalanceValue(pool()?.jackpot,6)}</Show></div></InfoItem>
            <InfoItem label={()=>t("b.balance")} ><Show when={!pool.loading} fallback={<div className="skeleton w-[6em] h-[1em]"></div>}>${toBalanceValue(pool()?.balance,6)}</Show></InfoItem>
              <InfoItem label={()=>t("b.wager")}  ><Show when={!pool.loading} fallback={<div className="skeleton w-[6em] h-[1em]"></div>}>${toBalanceValue(pool()?.bet?.[1],6)}</Show></InfoItem>
              <InfoItem label={()=>t("b.players")} ><Show when={!pool.loading} fallback={<div className="skeleton w-[3em] h-[1em]"></div>}>{pool()?.players}</Show></InfoItem>
              <InfoItem label={()=>t("b.tickets")} ><Show when={!pool.loading} fallback={<div className="skeleton w-[3em] h-[1em]"></div>}>{pool()?.bet?.[2]}</Show></InfoItem>
              <InfoItem label={()=>t("b.draw_time")} >
                <Show when={!pool.loading} fallback={<div className="skeleton w-[12em] h-[1em]"></div>}>
                  <div className="flex items-center gap-2">
                    {new Date(pool()?.ts_latest_draw).toLocaleString()}
                    <span
                      class="text-current/60 cursor-help inline-flex items-center text-xs bg-base-200 gap-1 rounded-full px-2 py-1 tooltip"
                      classList={{
                        "bg-secondary text-secondary-content" : draw_locker()
                      }}
                    >
                      <div class="tooltip-content">
                        <div className="text-left p-2">
                          {draw_locker()?
                            t("b.draw_time_fixed",{target:toBalanceValue(pool()?.wager_limit,6,1)}):
                            t("b.draw_time_est",{target:toBalanceValue(pool()?.wager_limit,6,1)})
                          }
                        </div>
                    
                      </div>
                      <span class="uppercase">
                      {draw_locker()?"Fixed":"Est."}
                      </span>
                      
                    </span>
                  </div>
                </Show>
              </InfoItem>
          </div>
        </div>
        <div className="col-span-full flex flex-col lg:justify-between lg:col-span-4 lg:col-start-9 py-2 lg:py-0 gap-4 lg:gap-6">
          
            <div className="flex justify-center flex-col items-center lg:items-start ">
              <div className="text-current/50 uppercase text-sm md:text-md">{t("b.countdown")}</div>
              <div className="text-xl">
                <Show when={!pool.loading} fallback={<div className="skeleton w-[6em] h-[1.2em]"></div>}>
                  <Switch>
                    <Match when={pool()?.run>0}>
                      <Show when={pool()?.ts_latest_draw>0} fallback="24:00:00">
                        <Countdown class="text-xl" end={pool()?.ts_latest_draw} />
                      </Show>
                      <Show when={draw_locker()}>
                        <span
                          class="cursor-help inline-flex items-center gap-2 tooltip"
                          data-tip={t("tooltop.draw_locker",{time:pool()?.ts_latest_draw?new Date(pool()?.ts_latest_draw).toLocaleString():"..."})}
                        >
                          <Icon icon="iconoir:lock" />
                        </span>
                      </Show>
                    </Match>
                    <Match when={pool()?.run<=0}>
                      <span class="text-xl">⏸️ {t("suspended")}</span>
                    </Match>
                  </Switch>
                </Show>
              </div>
            </div>
            <div className="flex-1 flex flex-col md:justify-between">
            <div className="text-xs lg:text-sm text-center md:text-left text-current/50">
              <Show when={!pool.loading} fallback={
                <div className="flex flex-col gap-2 w-full">
                  <span className=" skeleton w-full h-[1em]"></span>
                  <span className=" skeleton w-full h-[1em]"></span>
                  <span className=" skeleton w-2/3 h-[1em]"></span>
                </div>
              }>
              {t("b.draw_tip",{time:pool()?.draw_delay?pool()?.draw_delay/60000/60:"24",wager:pool()?.wager_limit?toBalanceValue(pool()?.wager_limit,6):"..."})}
              👉 Rules
              </Show>
            </div>
            <div className="py-4 px-2 md:px-0">
              <button 
                className="btn btn-primary btn-xl w-full md:w-fit rounded-2xl" 
                use:walletConnectionCheck={()=>_numpicker.open()}
                disabled={pool.loading || pool()?.run<=0 || pool()?.ts_round_start<=0}
              >
                {t("b.pick_and_bet")} <span className="kbd text-primary hidden md:inline-block">P</span>
              </button>
            </div>
            <div className=" flex items-center gap-4 justify-center md:justify-start divide-x divide-base-200  ">
              <div><span className="text-current/50">{t("b.price")} :</span> $1-$100</div>
              <a href="">Deposit</a>
            </div>
          </div>
        </div>
      </section>
      <Mint pool={pool}/>
      <Tickets pool={pool} ref={_tickets}/>
      
    </div>
    <Show when={!pool.loading}>
      <Numpicker 
        ref={_numpicker} 
        id="numpicker" 
        pool={pool}
        onSubmitted={(data)=>{
          refetchPool()
          _tickets.refetch()
          notify("Bet placed successfully.")
        }}
      />
    </Show>
    
    </>
    </ErrorBoundary>
  )
}