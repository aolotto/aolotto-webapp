import { InfoItem } from "../../components/infoitem"
import Ticker from "../../components/ticker"
import Bets from "./bets"
import { Icon } from "@iconify-icon/solid"
import { ShareToSocial } from "../../components/share"
import Numpicker from "../../components/numpicker"
import Countdown from "../../components/countdown"
import { walletConnectionCheck } from "../../components/arwallet"
import { state,mine,refetchPoolState,refetchBets,refetchStats,refetchMine } from "../../signals/pool"
import { createEffect, Show, createMemo,startTransition,batch,useTransition, onMount, createSignal } from "solid-js"
import { Datetime } from "../../components/moment"
import { toBalanceValue, generateRange } from "../../lib/tool"
import { pool,protocols,agent, app } from "../../signals/global"
import tooltip from "../../components/tooltip"
import Spinner from "../../components/spinner"
import { setDictionarys,t } from "../../i18n"

import { createSocialShare, TWITTER }  from "@solid-primitives/share";
import rewards from "../me/rewards"



export default props => {
  let _numpicker
  const pay_i = protocols?.details?.[protocols.pay_id]
  const pool_i = protocols?.details?.[protocols?.pool_id]
  const agent_i = protocols?.details?.[protocols?.agent_id]
  const draw_locker = createMemo(()=>{
    // if(state()&&pool()){
    //   return state()?.bet?.[1] >= Math.max(state()?.jackpot,1000 * pool()?.price)
    // }else{
    //   return false
    // }
    return false
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

  onMount(()=>{
    document.addEventListener("keydown", (e)=>{
      console.log(e)
      if(e.key==="p"&&state.state==="ready"){
        _numpicker.open()
      }
    });
  })

  setDictionarys("en",{
    "s.start" : "Started at ",
    "s.jackpot" : "Progressive Jackpot",
    "s.balance" : "Pool Balance",
    "s.wager" : "Wager Volume",
    "s.participation" : "Participation",
    "s.picked" : "Picked",
    "s.countdown" : "Count to the draw",
    "s.draw_tip" : ({time,wager})=><span>New bets extend the draw by <b class="text-base-content">{time}</b> hours from the time placed, until the wagers reach <b>${wager}</b>. Matching bets share the jackpot; If no match, the last bettor takes all.</span>,
    "s.price" : "Price",
    "u.bet" : "bet",
    "b.pick_and_bet" : "Pick and bet",
    "d.minting" : (v)=><span className="text-current/50">The minting balance this round is <span className="text-base-content">{v.balance}</span>/{v.total}$ALT, with a reward of <span className="text-base-content">{v.reward}</span> $ALT per bet.</span>
  })
  setDictionarys("zh",{
    "s.start" : "開始於 ",
    "s.jackpot" : "累積大獎",
    "s.balance" : "獎池餘額",
    "s.wager" : "投注總量",
    "s.participation" : "參與統計",
    "s.picked" : "已選號碼",
    "s.countdown" : "開獎倒計時",
    "s.draw_tip" : ({time,wager})=><span>新投注將會延長開獎時間至下注後的<b className="text-base-content">{time}</b>小時，直到累計投注量達到<b className="text-base-content">${wager}</b>；開獎後，號碼(000-999)匹配的投注共享大獎，若無投注匹配，最後下注者一人獨攬。</span>,
    "s.price" : "定价",
    "u.bet" : "注",
    "b.pick_and_bet" : "选号并下注",
    "d.minting" : (v)=><span className="text-current/50">本輪鑄幣餘額為 <span className="text-base-content">{v.balance}</span>/{v.total} $ALT，單筆投注的鑄幣獎勵為：<span className="text-base-content">{v.reward}</span> $ALT</span>
  })

  createEffect(()=>console.log(state()))

  return(
    <>
    <main class="container flex flex-col min-h-lvh/2">
      <section class="response_cols py-10">

        <div class="col-span-full md:col-span-6 lg:col-span-7 flex flex-col gap-8">
          <div class="h-16 flex items-center gap-4 w-fit">
            <span class=" border-2 text-xl h-12 w-16 rounded-full inline-flex items-center justify-center" use:tooltip={["bottom",()=>("Round "+state().round)]}><Show when={!state.loading} fallback={<Spinner size="sm"/>}>R{state().round}</Show></span>
            <span class="text-current/50 uppercase text-sm"><Show when={!state.loading} fallback="...">{t("s.start")} <Datetime ts={state()?.ts_round_start} display={"date"}/></Show></span>
       
            <button 
              className="btn btn-icon btn-ghost rounded-full btn-sm"
              onClick={()=>{
                setShareData({
                  title: `$1 to win $${toBalanceValue(state()?.jackpot||0,pay_i?.Denomination||6,0)}, last bettor takes at least a 50% higher chance to win on #Aolotto , Round-${state()?.round} is about to draw! 🏆`,
                  url: "https://aolotto.com"
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
            <InfoItem label={t("s.picked")}>
              <Show when={!state.loading} fallback="...">{state()?.picks}</Show> <span class="text-current/50">/ 1000</span> 
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
                    <Icon icon="iconoir:lock"></Icon>
                  </Show>
                </Show>
              </span>
              
          </div>
          <div class="flex flex-col justify-between flex-1 gap-4">
            <div class="text-current/50 text-sm">{t("s.draw_tip",{time:"24",wager:toBalanceValue(state()?.wager_limit,pay_i?.Denomination||6,1)})}<a target="_blank" href="https://docs.aolotto.com/en" class="inline-flex items-center">Learn more<Icon icon="ei:external-link"></Icon></a></div>
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
        <section class="response_cols py-8 border-t border-current/20 flex justify-center items-center">
          <span class="inline-flex bg-third text-third-content px-2 uppercase rounded-full py-0.5 items-center gap-1">Bet2Mint<Icon icon="carbon:information"></Icon></span> 
          <span >
          {t("d.minting",{
            balance : <Show when={!state.loading} fallback="...">{toBalanceValue(minting()?.quota?.[0],agent_i?.Denomination||12,2)}</Show>,
            total : toBalanceValue(minting()?.quota?.[1],agent_i?.Denomination||12,2),
            reward : toBalanceValue(minting()?.per_reward,agent_i?.Denomination||12,2)
          })}
           </span>
        </section>
      </Show>
      
      <Bets 
        id={pool.id}
        classList={{
          "opacity-20":isPending(),
          "opacity-100":!isPending()
        }}
        onXNumberClick={(v)=>{
          if(v?.length == pool.digits){
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
          refetchMine()
        })
        start(()=>refetchBets())
      }}
    />

    {/* <Numbers/> */}

    </>
  )
}