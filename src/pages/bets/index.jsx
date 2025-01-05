import { InfoItem } from "../../components/infoitem"
import Ticker from "../../components/ticker"
import Bets from "./bets"
import { Icon } from "@iconify-icon/solid"
import Numpicker from "../../components/numpicker"
import Countdown from "../../components/countdown"
import { walletConnectionCheck } from "../../components/wallet"
import { state,refetchPoolState,refetchBets,refetchStats,refetchPoolRanks,stats} from "../../signals/pool"
import { createEffect, Show, createMemo,startTransition,batch,useTransition, onMount, createSignal, onCleanup } from "solid-js"
import { Datetime } from "../../components/moment"
import { toBalanceValue, generateRange } from "../../lib/tool"
import { protocols, app } from "../../signals/global"
import tooltip from "../../components/tooltip"
import Spinner from "../../components/spinner"
import { setDictionarys,t } from "../../i18n"
import { tippy, useTippy } from 'solid-tippy';
import Rules from "../../components/rules"


import { createSocialShare, TWITTER }  from "@solid-primitives/share";




export default props => {
  let page_timer
  let _numpicker
  let _rules
  const pay_i = protocols?.details?.[protocols.pay_id]
  const pool_i = protocols?.details?.[protocols?.pool_id]
  const agent_i = protocols?.details?.[protocols?.agent_id]
  const draw_locker = createMemo(()=>{
    return state()?.bet?.[1] >= state()?.wager_limit
  })

  const [isPending, start] = useTransition();
  const price = createMemo(()=>pool_i && Number(pool_i?.Price))
  const minting = createMemo(()=>{
    if(state()){
      const {max_mint,minted,quota} = state()?.minting?state().minting:{max_mint:0,minted:0,quota:0}
      const speed = (Number(max_mint) - Number(minted)) / Number(max_mint)
      const per_reward = quota[0] * 0.001 * speed
      return {quota,minted, max_mint,per_reward,speed}
    }
    
  })
  const [shareData,setShareData] = createSignal({
    title: app.name,
    url: app.host,
  })

  const [share, close] = createSocialShare(() => shareData());

  const autoRefetchPage = function(){
    // refetchPoolState()
    // refetchStats()
  }

  onMount(()=>{
    document.addEventListener("keydown", (e)=>{
      console.log(e)
      if(e.key==="p"&&state.state==="ready"){
        _numpicker.open()
      }
    });

    page_timer = setInterval(()=>{
      autoRefetchPage()
    },10000)

  })

  onCleanup(()=>{
    clearInterval(page_timer)
  })

  setDictionarys("en",{
    "s.start" : "Started at ",
    "s.jackpot" : "Progressive Jackpot",
    "s.balance" : "Pool Balance",
    "s.wager" : "Wager Volume",
    "s.participation" : "Participation",
    "s.picked" : "Picked",
    "s.countdown" : "Count to the draw",
    "s.draw_time" : "Draw Time",
    "s.draw_tip" : ({time,wager})=><span>New bets extend the draw by <b class="text-base-content">{time}</b> hours from the time placed, until the wagers reach <b class="text-base-content">${wager}</b>. Matching bets share the jackpot; If no match, the last bettor takes all.</span>,
    "s.price" : "Price",
    "u.bet" : "bet",
    "b.pick_and_bet" : "Pick and bet",
    "d.minting" : (v)=><span className="text-current/50">The minting cap for this round left <span className="text-base-content">{v.balance}</span> / {v.total} $ALT, with <span className="text-base-content">{v.reward}</span> $ALT rewarded per $1 bet.</span>,
    "b.learn_more" : "Learn the rules",
    "tooltop.bet2mint" : ()=>"Aolotto's dividend token, $ALT, is minted through the Bet2Mint (bet to mining) mechanism in each round. The minting cap for each round is reset to 1/2000 of the remaining unminted $ALT (total supply of 210 million) at the start of the round. As the circulating supply increases, the minting cap gradually decreases. Users participating in the current betting round receive minting rewards based on their betting order. The minting reward for each bet is calculated as 1/1000 of the round's minting cap balance * the minting rate.",
    "tooltop.draw_locker" : (v)=> <span>The draw time has been locked to {v.time}</span>,
    "tooltop.draw_time_est" : (v)=> <span>When the wager volume is less than the target of ${v.target}, the draw time is only estimated,as it will be extended if new bets are placed</span>,
    "tooltop.draw_time_fixed" : (v)=> <span>The wager volume has reached the target of ${v.target}, the draw time is fixed.</span>,
    "tooltop.minting_speed" : (v)=> <span>The minting speed = (Max supply - current circulation) / Max supply</span>,
    "m.mint_tip" : (v)=><span>Remaining Bet2Mint rewards: <b class="text-base-content">{v.balance}</b> / {v.total} $ALT. Rewards for each bet are based on the reward ladder. When no new bets are placed, the last bettor gets <b class="text-base-content">~{v.auto_reward}</b> $ALT every <span class="text-base-content">10</span> minutes. To avoid missing out, place your bets ASAP.</span>,
    "m.bet" : "Bet"
  })
  setDictionarys("zh",{
    "s.start" : "開始於 ",
    "s.jackpot" : "累積大獎",
    "s.balance" : "獎池餘額",
    "s.wager" : "投注總量",
    "s.participation" : "參與統計",
    "s.picked" : "已選號碼",
    "s.countdown" : "開獎倒計時",
    "s.draw_time" : "開獎時間",
    "s.draw_tip" : ({time,wager})=><span>新投注將會延長開獎時間至下注後的<b className="text-base-content">{time}</b>小時，直到累計投注量達到<b className="text-base-content">${wager}</b>；開獎後，號碼(000-999)匹配的投注共享大獎，若無投注匹配，最後下注者一人獨攬。</span>,
    "s.price" : "定价",
    "u.bet" : "注",
    "b.pick_and_bet" : "选号并下注",
    "d.minting" : (v)=><span className="text-current/50">本輪鑄幣上限的余额仅剩 <span className="text-base-content">{v.balance}</span> / {v.total} $ALT，投注$1可获得鑄幣獎勵 <span className="text-base-content">{v.reward}</span> $ALT</span>,
    "b.learn_more" : "了解规则",
    "tooltop.bet2mint" : ()=>"Aolotto分红代币，$ALT通过Bet2Mint（投注挖矿）机制在轮次中铸造。每轮启动时铸币上限将重置为剩余未铸造的$ALT(总量为2.1亿)的1/2000。随着流通供应量的增长，铸币上限逐渐减少。参与当前投注轮次的用户根据其投注顺序获得铸币奖励。每次投注的铸币奖励该轮铸币上限余额的1/1000 * 铸币速度。",
    "tooltop.draw_locker" : (v)=> <span>开奖时间已锁定至{v.time}</span>,
    "tooltop.draw_time_est" : (v)=> <span>当投注量低于目标${v.target}时，开奖时间仅为预估, 因为一旦有新的投注追加时间将被延长</span>,
    "tooltop.draw_time_fixed" : (v)=> <span>投注量已达到目标${v.target}，开奖时间已固定。</span>,
    "tooltop.minting_speed" : (v)=> <span>铸币速度 = (最大发行量 - 当前流通量) / 最大发行量</span>,
    "m.mint_tip" : (v)=><span>本轮Bet2Mint铸币奖励剩余 <b class="text-base-content">{v.balance}</b> / {v.total} $ALT, 单次投注获得的奖励参照奖励阶梯；没有新的投注追加时，协议将每<span class="text-base-content">10分钟</span>奖励最后下注者 <span class="text-base-content">~{v.auto_reward}</span> $ALT,建议尽早下注，避免本轮铸币奖励被其它玩家耗光。</span>,
    "m.bet" : "投注",
    "m.mint_speed" : "铸币速度",
    "m.next_auto_mint" : "下一次铸币奖励",
    "m.count_auto_mint" : "自动奖励次数"
  })

  createEffect(()=>console.log("state",state(),"stats",stats()))

  return(
    <>
    <main class="container flex flex-col min-h-lvh/2">
      <section class="response_cols py-10">

        <div class="col-span-full md:col-span-6 lg:col-span-7 flex flex-col gap-8">
          <div class="h-16 flex items-center gap-4 w-fit">
            <span 
              class="border-2 text-xl h-12 w-16 rounded-full inline-flex items-center justify-center"
              use:tippy={{
                allowHTML: true,
                hidden: true,
                animation: 'fade',
                props: {
                  content : ()=><div class="tipy">Round {state()?.round}</div> 
                }
              }}
            >
              <Show when={!state.loading} fallback={<Spinner size="sm"/>}>R{state().round}</Show>
            </span>
            <span class="text-current/50 uppercase text-sm"><Show when={!state.loading} fallback="...">{t("s.start")} <Datetime ts={state()?.ts_round_start} display={"date"}/></Show></span>
       
            <button 
              className="btn btn-icon btn-ghost rounded-full btn-sm"
              onClick={()=>{
                setShareData({
                  title: `🏆$1 to win $${toBalanceValue(state()?.jackpot||0,pay_i?.Denomination||6,0)}! The last bettor gets at least a 50% better odds of WINNING on #Aolotto , ROUND-${state()?.round} is about to draw! 👉`,
                  url: "https://aolotto.com",
                })
                share(TWITTER)
              }}
            >
              <Icon icon="iconoir:share-android"></Icon>
            </button>
          </div>
          <div class="flex flex-col gap-2">
            <InfoItem label={t("s.jackpot")}>
              <div class="flex flex-col">
                <span class="text-3xl truncate w-full"><Show when={!state.loading} fallback="...">{toBalanceValue(state()?.jackpot,pay_i?.Denomination||6,2)}</Show></span>
                <Ticker class="text-current/50">{pay_i?.Ticker}</Ticker>
              </div>
            </InfoItem>
            <InfoItem label={t("s.balance")}>
              <span><Show when={!state.loading} fallback="...">{toBalanceValue(state()?.balance,pay_i?.Denomination||6,2)}</Show> </span> <Ticker class="text-current/50">{pay_i?.Ticker}</Ticker>
            </InfoItem>
            <InfoItem label={t("s.wager")}>
              <span><Show when={!state.loading} fallback="...">{toBalanceValue(state()?.bet?.[1],pay_i?.Denomination||6,2)}</Show></span> <Ticker class="text-current/50">{pay_i?.Ticker}</Ticker>
            </InfoItem>
            <InfoItem label={t("s.participation")}>
              <div class="flex gap-2">
                <span><Show when={!state.loading} fallback="...">{state()?.players}</Show></span>
                <span class="text-current/50">player{state()?.players>1&&"s"}</span>
                <span class="text-current/50">/</span>
                <span><Show when={!state.loading} fallback="...">{state()?.bet?.[2]}</Show></span>
                <span class="text-current/50">tickets</span>
              </div>
            </InfoItem>
            <InfoItem label={t("s.draw_time")}>
              <span
                class="flex items-center gap-2">
                <Show when={!state.loading} fallback="...">
                  {new Date(state()?.ts_latest_draw).toLocaleString()} 
                  <span
                    class="text-current/60 uppercase cursor-help inline-flex items-center text-xs bg-base-200 gap-1 rounded-full px-2 py-1"
                    use:tippy={{
                      allowHTML: true,
                      hidden: true,
                      animation: 'fade',
                      props: {
                        content : ()=><div class="bg-base-100 p-4 rounded-2xl border border-base-200">
                          {draw_locker()?
                            t("tooltop.draw_time_fixed",{target:toBalanceValue(state()?.wager_limit,pay_i?.Denomination||6,1)}):
                            t("tooltop.draw_time_est",{target:toBalanceValue(state()?.wager_limit,pay_i?.Denomination||6,1)})
                          }
                        </div> 
                      }
                    }}
                  >
                    {draw_locker()?"Fixed":"Est."}
                  </span></Show> 
              </span>
            </InfoItem>
          </div>
        </div>

        <div class="col-span-full md:col-span-4 md:col-start-7 lg:col-span-4 lg:col-start-9 flex flex-col gap-8">
          <div class="flex flex-col h-16 justify-center">
              <span class="uppercase text-current/50 text-sm">{t("s.countdown")}</span>
              <span class="inline-flex items-center gap-2">
                <Show when={state.state=="ready"} fallback="--:--:--">
                  <Show when={state()?.ts_latest_draw>0} fallback="24:00:00">
                    <Countdown class="text-xl" end={state()?.ts_latest_draw} />
                  </Show>
                  
                  <Show when={draw_locker()}>
                    <span
                      class="cursor-help inline-flex items-center gap-2"
                      use:tippy={{
                        allowHTML: true,
                        hidden: true,
                        animation: 'fade',
                        props: {
                          content : ()=><div class="tipy">{t("tooltop.draw_locker",{time:state()?.ts_latest_draw?new Date(state()?.ts_latest_draw).toLocaleString():"..."})}</div> 
                        }
                    }}>
                      <Icon icon="iconoir:lock" />
                    </span>
                    
                  </Show>
                </Show>
              </span>
              
          </div>
          <div class="flex flex-col justify-between flex-1 gap-4">
            <div class="text-current/50 text-sm">
              {t("s.draw_tip",{time:"24",wager:state()?.wager_limit?toBalanceValue(state()?.wager_limit,pay_i?.Denomination||6,1):"..."})}
              <button class="text-primary cursor-pointer" onClick={()=>_rules?.open()}>
                {t("b.learn_more")}
              </button>
            </div>
            <div>
              <button 
                class="btn btn-xl btn-primary"
                disabled={state.loading}
                use:walletConnectionCheck={()=>_numpicker.open()}
              >
                <span class="inline-flex gap-4"><span>{t("b.pick_and_bet")}</span> <kbd class="kbd">P</kbd></span>
              </button>
            </div>
            <div
              class="inline-flex items-center gap-2 py-2"
            >
              <span class="text-current/50 uppercase">{t("s.price")}: </span><Show when={price()} fallback="...">{toBalanceValue(price(),pay_i.Denomination||6,1)}</Show> <span class="text-current/50"><Ticker>{pay_i.Ticker}</Ticker>/{t("u.bet")}</span> 
            </div>
            </div>

          </div>
          
      </section>

      <Show when={minting()}>
        <section class="response_cols py-8 border-t border-current/20 ">
          <div class="col-span-7 flex flex-col">
            <InfoItem
              label={
                <div class=" flex flex-col justify-between h-full">
                  <span
                    use:tippy={{
                    allowHTML: true,
                    hidden: true,
                    animation: 'fade',
                    props: {
                      content : ()=><div class="tipy">
                        <div>{t("tooltop.bet2mint")}</div>
                        <div class="pt-2 mt-2 border-t border-current/20">
                          {t("tooltop.minting_speed")}
                        </div>
                      </div> 
                    }
                  }}
                  class="inline-flex bg-third text-third-content px-2 uppercase rounded-full py-0.5 items-center gap-1 cursor-help w-fit"
                >
                  Bet2Mint<Icon icon="carbon:information"></Icon>
                </span>
                <div class="flex flex-col gap-1">
                  <div class="text-xs flex gap-1"><Icon icon="ph:arrow-elbow-down-right-light"/>铸币速度：<span class="text-base-content">~{toBalanceValue(state()?.mint_speed,0,12)}</span></div>
                  <div class="text-xs flex gap-1"><Icon icon="ph:arrow-elbow-down-right-light"/>下一次自动奖励：<span class="text-base-content"><Countdown end={(state()?.latest_minting_plus||state()?.ts_latest_bet)+600000} /></span></div>
                  <div class="text-xs flex gap-1"><Icon icon="ph:arrow-elbow-down-right-light"/>自动奖励次数: <span class="text-base-content">{state()?.minting_plus?.[1]}</span></div>
                </div>
              </div>
              }
            >
              <span class="text-sm text-current/50">
              {t("m.mint_tip",{
                balance: toBalanceValue(minting()?.quota?.[0],agent_i?.Denomination||12,3),
                total: toBalanceValue(minting()?.quota?.[1],agent_i?.Denomination||12,3),
                auto_reward: toBalanceValue(minting()?.per_reward * 1 * 0.1,agent_i?.Denomination||12,3)
              })}
              </span>
            </InfoItem>
            
            
          </div>
          
          <div class="col-span-4 col-start-9 flex flex-col gap-1 justify-between">
            <li class="text-sm text-current/50 flex items-center gap-2"><span class="text-third-content bg-third text-xs px-[3px] py-[2px] inline-block rounded-sm">L4</span> {t("m.bet")} <span class="text-base-content">$100</span> <Icon icon="iconoir:arrow-right" class="text-current/50"/> <span class="text-base-content">{toBalanceValue(minting()?.per_reward * 100 * 1,agent_i?.Denomination||12,3)}</span> $ALT</li>
            <li class="text-sm text-current/50 flex items-center gap-2"><span class="text-third-content bg-third/80 text-xs px-[3px] py-[2px] inline-block rounded-sm">L3</span> {t("m.bet")} <span class="text-base-content">$50-99</span> <Icon icon="iconoir:arrow-right" class="text-current/50"/> <span class="text-base-content">{toBalanceValue(minting()?.per_reward * 50 * 0.6,agent_i?.Denomination||12,3)}-{toBalanceValue(minting()?.per_reward * 99 * 0.6,agent_i?.Denomination||12,3)}</span> $ALT</li>
            <li class="text-sm text-current/50 flex items-center gap-2"><span class="text-third-content bg-third/60 text-xs px-[3px] py-[2px] inline-block rounded-sm">L2</span> {t("m.bet")} <span class="text-base-content">$10-49</span> <Icon icon="iconoir:arrow-right" class="text-current/50"/> <span class="text-base-content">{toBalanceValue(minting()?.per_reward * 10 * 0.3,agent_i?.Denomination||12,3)}-{toBalanceValue(minting()?.per_reward * 49 * 0.3,agent_i?.Denomination||12,3)}</span> $ALT</li>
            <li class="text-sm text-current/50 flex items-center gap-2"><span class="text-third-content bg-third/40 text-xs px-[3px] py-[2px] inline-block rounded-sm">L1</span> {t("m.bet")} <span class="text-base-content">$1-9</span> <Icon icon="iconoir:arrow-right" class="text-current/50"/> <span class="text-base-content">{toBalanceValue(minting()?.per_reward * 1 * 0.1,agent_i?.Denomination||12,3)}-{toBalanceValue(minting()?.per_reward * 9 * 0.1,agent_i?.Denomination||12,3)}</span> $ALT</li>
          </div>
        </section>
      </Show>
      
      <Bets 
        id={protocols?.pool_id}
        classList={{
          "opacity-20":isPending(),
          "opacity-100":!isPending()
        }}
        onXNumberClick={(v)=>{
          if(v?.length == Number(pool_i?.Digits)){
            _numpicker.open(v)
          }
        }}
      />
    </main>

    <Numpicker 
      ref={_numpicker} 
      state={state()}
      digits={pool_i?.Digits&&Number(pool_i?.Digits)}
      minting={minting()}
      onSubmitted={(res)=>{
        batch(()=>{
          refetchPoolState()
          refetchStats()
          refetchPoolRanks()
        })
        start(()=>refetchBets())
      }}
    />

    <Rules ref={_rules}/>

    </>
  )
}