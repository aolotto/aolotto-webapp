import { InfoItem } from "../../components/infoitem"
import Ticker from "../../components/ticker"
import Bets from "./bets"
import { Icon } from "@iconify-icon/solid"
import Numpicker from "../../components/numpicker"
import Countdown from "../../components/countdown"
import { walletConnectionCheck } from "../../components/wallet"
import { pool,refetchPool,refetchStats} from "../../data/resouces"
import { createEffect, Show, createMemo,batch,useTransition, onMount, createSignal, onCleanup,Switch, Match } from "solid-js"
import { Datetime } from "../../components/moment"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { protocols, app } from "../../data/info"
import Spinner from "../../components/spinner"
import { setDictionarys,t } from "../../i18n"
import Rules from "../../components/rules"
import { createSocialShare, TWITTER }  from "@solid-primitives/share";
import Recharger from "../../components/recharger"
import intervalWorker from "../../lib/interval_worker"
import { A } from "@solidjs/router"
import PrizeDetail from "../../components/prize_detail"
import toast from "solid-toast"





export default props => {
  let _numpicker
  let _rules
  let _prize_pie
  let _bets
  let pool_timer = new Worker(intervalWorker);
  let last_update
  
  const pay_i = protocols?.details?.[protocols.pay_id]
  const pool_i = protocols?.details?.[protocols?.pool_id]
  const agent_i = protocols?.details?.[protocols?.agent_id]
  
  const draw_locker = createMemo(()=>{
    return pool()?.bet?.[1] >= pool()?.wager_limit
  })

  const price = createMemo(()=>pool_i && Number(pool_i?.Price))
  const pie_rate = createMemo(()=>{
    if(1-pool()?.bet?.[1] >= pool()?.wager_limit){
      return 0
    }else{
     return (1-Math.max(pool()?.bet?.[1]/pool()?.wager_limit,0.01))*100
    }
    
  })
  const minting = createMemo(()=>{
    if(pool()){
      const {max_mint,minted,quota} = pool()?.minting?pool().minting:{max_mint:0,minted:0,quota:0}
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
  const [switching,setSwitching] = createSignal(false)
  const [update,setUpdate] = createSignal()



  onMount(()=>{
    document.addEventListener("keydown", (e)=>{
      if(e.key==="p"&&pool.state==="ready"&&pool()?.run==1&&pool()?.ts_round_start>0){
        _numpicker.open()
      }
    });

    if(window.Worker){
      pool_timer.addEventListener("message",function(evt){
        if(pool.state == "ready"&&pool()?.ts_latest_draw>0&&window.Worker){
          const diff = pool().ts_latest_draw - evt.data
          if(diff<=0&&!switching()){
            setSwitching(true)
            _numpicker.close()
          }
          if(!last_update){
            last_update = evt.data
          }
          if(evt.data-last_update>=1000 * 60 * 5){
            console.log("update")
            last_update = evt.data
            fetchPool(protocols?.pool_id,{refetch:true}).then(
              (res)=>{
                if(res.round == pool().round){
                  const diff_tickets = res.bet[2] - pool()?.bet[2]
                  if(diff_tickets>0){
                    setUpdate(diff_tickets)
                  }
                }else{
                  batch(()=>{
                    setUpdate(null)
                    // refetchBets()
                    refetchPool()
                    // refetchStats()
                  })
                }
              }
            )
          }
        }
        
      })
    }
  })

  onCleanup(()=>{
    pool_timer.terminate();
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
    "b.betting_paused" : "Betting Paused",
    "b.learn_more" : "👉 Rules",
    "tooltop.bet2mint" : ()=>"$ALT (The Dividends Token) is minted in rounds via the Bet2Mint mechanism. At the start of each round, the minting reward is reset to (max supply - current supply) * 0.002. Users receive minting rewards based on their betting order, calculated as: current round’s Bet2Mint balance * minting speed [1] * reward ladder coefficient",
    "tooltop.draw_locker" : (v)=> `The draw time has been locked to ${v.time}`,
    "tooltop.draw_time_est" : (v)=> <span>When the wager volume is less than the target of ${v.target}, the draw time is only estimated,as it will be extended if new bets are placed</span>,
    "tooltop.draw_time_fixed" : (v)=> <span>The wager volume has reached the target of ${v.target}, the draw time is fixed.</span>,
    "tooltop.minting_speed" : (v)=> <span>[1] Minting Speed = 1 - max supply / current supply</span>,
    "m.mint_tip" : (v)=><span class='leading-[0.5em]'>Remaining Bet2Mint rewards in this round: <b class="text-base-content">{v.balance}</b> / {v.total} $ALT. Rewards for each bet follow the ladder. If no new bets, the last bettor will gets <b class="text-base-content">~{v.auto_reward}</b> $ALT Gap-Reward every <span class="text-base-content">10m</span>, Bet NOW or watch the rewards vanish!</span>,
    "m.bet" : "Bet",
    "m.mint_speed" : "Mint Speed",
    "m.next_auto_mint" : "latest Gap-Reward",
    "m.count_auto_mint" : "Gap-Reward Count",
    "m.supply" : "Circulation",
    "tooltip.reward_ladder_1" : "L1: Bet amount between $1-9, reward coefficient = 0.0001, the actual amount is calculated based on the current Bet2Mint balance",
    "tooltip.reward_ladder_2" : "L2: Bet amount between $10-49, reward coefficient = 0.0003, the actual amount is calculated based on the current Bet2Mint balance",
    "tooltip.reward_ladder_3" : "L3: Bet amount between $50-99, reward coefficient = 0.0006, the actual amount is calculated based on the current Bet2Mint balance",
    "tooltip.reward_ladder_4" : "L4: Bet amount at the maximum limit of $100, reward coefficient = 0.001, the actual amount is calculated based on the current Bet2Mint balance",
    "a.deposit" : "Deposit",
    "suspended" : "Suspended",
    "maintenace.tip" : (v)=><span>Aolotto Round {v} is suspended due to maintenance. Betting and Gap-Rewards distribution will resume shortly.</span>,
    "rw.title" : (v) => <span>🏁 Round {v} has ended</span>,
    "rw.button" : "Head to next round",
    "rw.disc" : ()=><span>The winning result will be generated in the 5th block after the round ends. Head to <A href="/draws">Draws</A> or follow the official <a href="https://x.com/aolotto_dao" target="_blank">X</a> for the announcement!</span>
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
    "b.betting_paused" : "暂时停止下注",
    "b.learn_more" : "👉了解规则",
    "tooltop.bet2mint" : ()=>"$ALT(分红代币)通过Bet2Mint机制逐轮发行; 每轮启动时重置本轮铸币奖励的总额为(最大流通量-当前流通量)*0.002; 参与当前投注轮次的用户根据其投注顺序获得铸币奖励,每次投注的铸币奖励=该轮Bet2Mint余额 * 铸币速度[1] * 阶梯奖励系数",
    "tooltop.draw_locker" : (v)=> `开奖时间已锁定至${v.time}`,
    "tooltop.draw_time_est" : (v)=> <span>当投注量低于目标${v.target}时，开奖时间仅为预估, 因为一旦有新的投注追加时间将被延长</span>,
    "tooltop.draw_time_fixed" : (v)=> <span>投注量已达到目标${v.target}，开奖时间已固定。</span>,
    "tooltop.minting_speed" : (v)=> <span>[1] 铸币速度 = 1-(当前流通量/最大发行量)</span>,
    "m.mint_tip" : (v)=><span>本轮Bet2Mint铸币奖励剩余 <b class="text-base-content">{v.balance}</b> / {v.total} $ALT, 单次投注获得的奖励参照奖励阶梯；没有新的投注追加时，协议将每<span class="text-base-content">10分钟</span>下发一次空当奖励 <span class="text-base-content">~{v.auto_reward}</span> $ALT给最后下注者,建议尽早下注，避免本轮铸币奖励被其它玩家耗光。</span>,
    "m.bet" : "投注",
    "m.mint_speed" : "铸币速度",
    "m.next_auto_mint" : "最近一次空当奖励",
    "m.count_auto_mint" : "空当奖励次数",
    "m.supply" : "循环流通",
    "tooltip.reward_ladder_1" : "L1：投注金额位于 $1-9 区间，奖励系数为 0.0001,实际奖励金额基于当前Bet2Mint余额计算",
    "tooltip.reward_ladder_2" : "L2：投注金额位于 $10-49 区间，奖励系数为 0.0003,实际奖励金额基于当前Bet2Mint余额计算",
    "tooltip.reward_ladder_3" : "L3：投注金额位于 $50-99 区间，奖励系数为 0.0006,实际奖励金额基于当前Bet2Mint余额计算",
    "tooltip.reward_ladder_4" : "L4：投注金额达到最高投注上限 $100，奖励系数为 0.001,实际奖励金额基于当前Bet2Mint余额计算",
    "a.deposit" : "储值",
    "suspended" : "已暂停",
    "maintenace.tip" : (v)=><span>Aolotto 第{v}轮因维护暂停，下注及空当奖励的发放稍后恢复。</span>,
    "rw.title" : (v) => <span>🏁 第 {v} 轮投注结束</span>,
    "rw.button" : "进入下一轮投注",
    "rw.disc" : ()=><span>开奖结果将会在轮次结束后的第五个区块上生成. 前往 <A href="/draws">开奖</A> 或关注官方 <a href="https://x.com/aolotto_dao" target="_blank">X</a> 账号获取最新的开奖通知!</span>
  })

  return(
    <>
    <main class="container flex flex-col min-h-lvh/2 overflow-visible">
      
      <Show when={pool.state==="ready" && pool()?.run <= 0}>
        <div role="alert" className="alert alert-warning mt-6 flex items-center justify-center">
          <div>⚠️ {t("maintenace.tip",pool()?.round)}</div>
        </div>
      </Show>
      

      <section class="response_cols py-10 overflow-visible">
        
        <div class="col-span-full md:col-span-6 lg:col-span-7 flex flex-col gap-8 overflow-visible">
          <div class="h-16 flex items-center gap-4 w-fit overflow-visible">
            <span 
              class="border-2 text-xl h-12 w-16 rounded-full inline-flex items-center justify-center tooltip"
              data-tip={"Round "+pool()?.round}
            >
              <Show when={!pool.loading} fallback={<Spinner size="sm"/>}>R{pool().round}</Show>
            </span>
            <span 
              class="text-current/50 uppercase text-sm">
                <Show when={!pool.loading} fallback="...">
                  <Switch>
                    <Match when={pool().ts_round_start<=0}>NOT STARTED</Match>
                    <Match  when={pool().ts_round_start>0}>{t("s.start")} <Datetime ts={pool()?.ts_round_start} display={"date"}/></Match>
                  </Switch>
                </Show>
              </span>
       
            <button 
              className="btn btn-icon btn-ghost rounded-full btn-sm"
              onClick={()=>{
                setShareData({
                  title: `🏆$1 to win $${toBalanceValue(pool()?.jackpot||0,pay_i?.Denomination||6,0)}! The last bettor gets at least a 50% better odds of WINNING on #Aolotto , ROUND-${pool()?.round} is about to draw! 👉`,
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
                <span class="text-3xl truncate w-full flex items-center gap-4 overflow-visible">
                  <Show when={!pool.loading} fallback="...">
                    {toBalanceValue(pool()?.jackpot,pay_i?.Denomination||6,2)}
                    <button
                      className="tooltip cursor-pointer"
                      data-tip="jackpot pie"
                      onClick={()=>_prize_pie.open(pool())}
                    >
                      <div className="tooltip-content">
                        <div className="animate-bounce text-orange-400 -rotate-2 text-2xl font-black">🍕 Jackpot Pie</div>
                      </div>
                      <figure className="flex place-content-center flex-wrap gap-[1em] size-[0.7em]">
                        <div
                          className=" flex-1 aspect-square rounded-full flex items-center justify-center"
                          style={{background: `conic-gradient(var(--color-accent) 0% ${pie_rate()||0}%, var(--color-primary) ${pie_rate()||0}% 100%)`}}
                        >
                        </div>
                      </figure>
                    </button>
                  </Show>
                </span>
                <Ticker class="text-current/50">{pay_i?.Ticker}</Ticker>
              </div>
            </InfoItem>
            <InfoItem label={t("s.balance")}>
              <span><Show when={!pool.loading} fallback="...">{toBalanceValue(pool()?.balance,pay_i?.Denomination||6,2)}</Show> </span> <Ticker class="text-current/50">{pay_i?.Ticker}</Ticker>
            </InfoItem>
            <InfoItem label={t("s.wager")}>
              <span><Show when={!pool.loading} fallback="...">{toBalanceValue(pool()?.bet?.[1],pay_i?.Denomination||6,2)}</Show></span> <Ticker class="text-current/50">{pay_i?.Ticker}</Ticker>
            </InfoItem>
            <InfoItem label={t("s.participation")}>
              <div class="flex gap-2">
                <span><Show when={!pool.loading} fallback="...">{pool()?.players}</Show></span>
                <span class="text-current/50">player{pool()?.players>1&&"s"}</span>
                <span class="text-current/50">/</span>
                <span><Show when={!pool.loading} fallback="...">{pool()?.bet?.[2]}</Show></span>
                <span class="text-current/50">tickets</span>
              </div>
            </InfoItem>
            <InfoItem label={t("s.draw_time")}>
              <span
                class="flex items-center gap-2">
                <Show when={!pool.loading} fallback="...">
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
                        t("tooltop.draw_time_fixed",{target:toBalanceValue(pool()?.wager_limit,pay_i?.Denomination||6,1)}):
                        t("tooltop.draw_time_est",{target:toBalanceValue(pool()?.wager_limit,pay_i?.Denomination||6,1)})
                      }
                      </div>
                      
                      </div>
                      <span class="uppercase">
                      {draw_locker()?"Fixed":"Est."}
                      </span>
                    
                  </span></Show> 
              </span>
            </InfoItem>
          </div>
        </div>

        <div class="col-span-full md:col-span-4 md:col-start-7 lg:col-span-4 lg:col-start-9 flex flex-col gap-8">
          <div class="flex flex-col h-16 justify-center">
              <span class="uppercase text-current/50 text-sm">{t("s.countdown")}</span>
              <span class="inline-flex items-center gap-2">
                <Show when={pool.state=="ready"} fallback="--:--:--">
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
              </span>
              
          </div>
          <div class="flex flex-col justify-between flex-1 gap-4">
            <div class="text-current/50 text-sm">
              {t("s.draw_tip",{time:pool()?.draw_delay?pool()?.draw_delay/60000/60:"24",wager:pool()?.wager_limit?toBalanceValue(pool()?.wager_limit,pay_i?.Denomination||6,1):"..."})}
              <button class="text-primary cursor-pointer" onClick={()=>_rules?.open()}>
                {t("b.learn_more")}
              </button>
            </div>
            <div>
              <button 
                class="btn btn-xl btn-primary bg-linear-to-r/srgb from-indigo-500 to-teal-400"
                classList = {{
                  "animate-wiggle" : pool.state=="ready" || pool()?.run == 1,
                  "": pool.state != "ready" || pool()?.run != 1 || pool()?.ts_round_start <= 0
                }}
                disabled={pool.loading || pool()?.run<=0 || pool()?.ts_round_start<=0}
                use:walletConnectionCheck={()=>_numpicker.open()}
              >
                <Switch fallback={t("b.pick_and_bet")}>
                  <Match when={pool.state =="ready" &&pool()?.run == 1 && pool()?.ts_round_start > 0}>
                    <span class="inline-flex gap-4 items-center"><span>{t("b.pick_and_bet")}</span> <kbd class="kbd kbd-sm text-base-content rounded-xs">P</kbd></span>
                  </Match>
                  <Match when={pool.state =="ready" &&pool()?.run == 0}>
                    <span class="inline-flex gap-4 items-center"><span>{t("b.betting_paused")}</span></span>
                  </Match>
                </Switch>
              </button>
            </div>
            <div
              class="inline-flex items-center gap-2 py-2"
            >
              <span class="text-current/50 uppercase">
                {t("s.price")}: </span><Show when={price()} fallback="...">{toBalanceValue(price(),pay_i.Denomination||6,1)}</Show> <span class="text-current/50"><Ticker>{pay_i.Ticker}</Ticker>/{t("u.bet")}
              </span> 
              <span class="text-current/50">-</span>
              <Recharger/>
            </div>
            </div>

          </div>
          
      </section>

      <Show when={minting()||!pool.loading}>
        <section class="response_cols py-8 border-t border-current/20 overflow-visible">
          <div class="col-span-7 flex flex-col">
            <InfoItem
              label={
                <div class=" flex flex-col justify-between h-full">
                  <span
                    class=" tooltip w-fit"
                  >
                    <div className="tooltip-content">
                      <div className="text-sm text-left p-2">
                        <div>{t("tooltop.bet2mint")}</div>
                        <div class="pt-2 mt-2 border-t border-current/20">{t("tooltop.minting_speed")}</div>
                      </div>
                    </div>
                    <span className="inline-flex bg-accent text-accent-content px-2 uppercase rounded-full py-0.5 items-center gap-1 cursor-help w-fit mt-2">
                    Bet2Mint
                    <Icon icon="carbon:information"></Icon>
                    </span>
                    
                  </span>
                  
                <div class="flex flex-col gap-2">
                  <div class="text-xs flex gap-1"><Icon icon="ph:arrow-elbow-down-right-light"/>{t("m.mint_speed")}: <span class="text-base-content tooltip" 
                    data-tip = {toBalanceValue(pool()?.mint_speed*100,0,12)}
                  >~ <Show when={!pool.loading} fallback="...">{toBalanceValue(pool()?.mint_speed*100,0,2)}</Show> %</span></div>
                  <div class="text-xs flex gap-1"><Icon icon="ph:arrow-elbow-down-right-light"/>{t("m.supply")}: <span 
                    class="text-base-content tooltip"  
                    data-tip = {toBalanceValue(pool()?.minting?.minted,12,12)}
                  >
                    {toBalanceValue(pool()?.minting?.minted,12,0)}</span> $ALT
                  </div>
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
            <li class="text-sm text-current/50 flex items-center gap-2"><span class="text-accent-content bg-accent text-xs px-[3px] py-[2px] inline-block rounded-sm tooltip"
              data-tip={t("tooltip.reward_ladder_4")}
              >L4</span> {t("m.bet")} <span class="text-base-content">$100</span> <Icon icon="iconoir:arrow-right" class="text-current/50"/> <span class="text-base-content">~ {toBalanceValue(minting()?.per_reward * 100 * 1,agent_i?.Denomination||12,3)}</span> $ALT</li>
            <li class="text-sm text-current/50 flex items-center gap-2"><span class="text-accent-content bg-accent/80 text-xs px-[3px] py-[2px] inline-block rounded-sm tooltip"
              data-tip={t("tooltip.reward_ladder_3")}
              >L3</span> {t("m.bet")} <span class="text-base-content">$50-99</span> <Icon icon="iconoir:arrow-right" class="text-current/50"/> <span class="text-base-content">~ {toBalanceValue(minting()?.per_reward * 50 * 0.6,agent_i?.Denomination||12,3)}-{toBalanceValue(minting()?.per_reward * 99 * 0.6,agent_i?.Denomination||12,3)}</span> $ALT</li>
            <li class="text-sm text-current/50 flex items-center gap-2"><span class="text-accent-content bg-accent/60 text-xs px-[3px] py-[2px] inline-block rounded-sm tooltip"
              data-tip={t("tooltip.reward_ladder_2")}
              >L2</span> {t("m.bet")} <span class="text-base-content">$10-49</span> <Icon icon="iconoir:arrow-right" class="text-current/50"/> <span class="text-base-content">~ {toBalanceValue(minting()?.per_reward * 10 * 0.3,agent_i?.Denomination||12,3)}-{toBalanceValue(minting()?.per_reward * 49 * 0.3,agent_i?.Denomination||12,3)}</span> $ALT</li>
            <li class="text-sm text-current/50 flex items-center gap-2"
            ><span class="text-accent-content bg-accent/40 text-xs px-[3px] py-[2px] inline-block rounded-sm tooltip"
              data-tip={t("tooltip.reward_ladder_1")}
            >L1</span> {t("m.bet")} <span class="text-base-content">$1-9</span> <Icon icon="iconoir:arrow-right" class="text-current/50"/> <span class="text-base-content">~ {toBalanceValue(minting()?.per_reward * 1 * 0.1,agent_i?.Denomination||12,3)}-{toBalanceValue(minting()?.per_reward * 9 * 0.1,agent_i?.Denomination||12,3)}</span> $ALT</li>
          </div>
        </section>
      </Show>
 
      <Bets 
        id={protocols?.pool_id}
        ref = {_bets}
        update = {update()}
        state = {pool()}
        pool_loading = {pool.loading}
        onClickJackpotPie = {()=>_prize_pie.open(pool())}
        onClickUpdate = {()=>{
          batch(()=>{
            setUpdate(null)
            // refetchBets()
            refetchPool()
            // refetchStats()
          })
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
      state={pool()}
      digits={pool_i?.Digits&&Number(pool_i?.Digits)}
      minting={minting()}
      onSubmitted={async({id,data})=>{
        console.log("投注成功",id,data)
        toast.success(
        <div className="w-full flex items-center justify-between gap-4">
          <span>Placed a $1 bet </span>
          <span className="text-current/50 text-sm inline-flex items-center gap-2">
            {shortStr(id,4)} 
            <Icon icon="hugeicons:square-arrow-expand-01" />
          </span>
        </div>,
        {
          duration: 5000,
        })
        await refetchPool()
        // _bets.refetch()
        // await refetchStats()
        
        
      }}
    />

    <Rules ref={_rules}/>
    <div
      className="w-[100vw] h-[100vh] backdrop-blur-3xl fixed top-0 left-0 flex items-center justify-center flex-col gap-8 transition-opacity"
      classList={{
        "visible opacity-100" : switching(),
        "invisible opacity-0" : !switching()
      }}
    >
      <div className="text-3xl">
      {t("rw.title",pool()?.round)}
      </div>
      <div>
        <button
          className="btn btn-primary btn-lg"
          onClick={()=>{
            batch(async()=>{
              await refetchPool()
              await refetchStats()
            })
            setSwitching(false)
          }}
        >
          {t("rw.button")} <Icon icon="iconoir:arrow-right"/>
        </button>
      </div>
      <div className="text-sm w-[30%] min-w-[320px] text-current/50 text-center">
          {t("rw.disc")}
      </div>
    </div>
    <PrizeDetail ref={_prize_pie}/>

    {/* </ErrorBoundary> */}
    </>
  )
}