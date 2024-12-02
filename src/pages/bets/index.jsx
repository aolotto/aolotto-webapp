import { InfoItem } from "../../components/infoitem"
import Ticker from "../../components/ticker"
import Bets from "./bets"
import { Icon } from "@iconify-icon/solid"
import { ShareToSocial } from "../../components/share"
import Numpicker from "../../components/numpicker"
import Countdown from "../../components/countdown"
import { walletConnectionCheck } from "../../components/arwallet"
import { state,mine,refetchPoolState,refetchBets,refetchPoolStats,refetchMine } from "../../signals/pool"
import { createEffect, Show, createMemo,startTransition,batch,useTransition, onMount } from "solid-js"
import { Datetime } from "../../components/moment"
import { toBalanceValue, generateRange } from "../../lib/tool"
import { pool,app,agent, currency } from "../../signals/global"
import tooltip from "../../components/tooltip"
import Spinner from "../../components/spinner"



export default props => {
  let _numpicker

  

  const draw_locker = createMemo(()=>{
    // if(state()&&pool()){
    //   return state()?.bet?.[1] >= Math.max(state()?.jackpot,1000 * pool()?.price)
    // }else{
    //   return false
    // }
    return false
  })

  const [isPending, start] = useTransition();
  const price = createMemo(()=>pool && Number(pool?.price))

  onMount(()=>{
    document.addEventListener("keydown", (e)=>{
      console.log(e)
      if(e.key==="p"&&state.state==="ready"){
        _numpicker.open()
      }
    });
  })

  createEffect(()=>console.log(mine()))


  return(
    <>
    <main class="container flex flex-col min-h-lvh/2">
      <section class="response_cols py-10">

        <div class="col-span-full md:col-span-6 lg:col-span-7 flex flex-col gap-8">
          <div class="h-16 flex items-center gap-4 w-fit">
            <span class=" border-2 text-xl h-12 w-16 rounded-full inline-flex items-center justify-center" use:tooltip={["bottom",()=>("Round "+state().round)]}><Show when={!state.loading} fallback={<Spinner size="sm"/>}>R{state().round}</Show></span>
            <span class="text-current/50 uppercase text-sm"><Show when={!state.loading} fallback="..."> Started at <Datetime ts={state()?.ts_round_start} display={"date"}/></Show></span>
            <ShareToSocial/>
          </div>
          <div class="flex flex-col gap-2">
            <InfoItem label={"Progressive Jackpot"}>
              <div class="flex flex-col">
                <span class="text-3xl truncate w-full"><Show when={!state.loading} fallback="...">{toBalanceValue(state()?.jackpot,pool?.denomination||6,2)}</Show></span>
                <Ticker class="text-current/50">{pool?.ticker}</Ticker>
              </div>
            </InfoItem>
            <InfoItem label={"Pool Balance"}>
              <span><Show when={!state.loading} fallback="...">{toBalanceValue(state()?.balance,pool?.asset_bet?.[1]||6,2)}</Show> </span> <Ticker class="text-current/50">{pool?.asset_bet?.[0]}</Ticker>
            </InfoItem>
            <InfoItem label={"Wager Volume"}>
              <span><Show when={!state.loading} fallback="...">{toBalanceValue(state()?.bet?.[1],pool?.asset_bet?.[1]||6,2)}</Show></span> <Ticker class="text-current/50">{pool?.asset_bet?.[0]}</Ticker>
            </InfoItem>
            <InfoItem label={"Participation"}>
              <div class="flex gap-2">
                <span><Show when={!state.loading} fallback="...">{state()?.players}</Show></span>
                <span class="text-current/50">player{state()?.players>1&&"s"}</span>
                <span class="text-current/50">/</span>
                <span><Show when={!state.loading} fallback="...">{state()?.bet?.[2]}</Show></span>
                <span class="text-current/50">tickets</span>
              </div>
            </InfoItem>
            <InfoItem label={"Picked Numbers"}>
              <Show when={!state.loading} fallback="...">{state()?.picks}</Show> <span class="text-current/50">/ 1000</span> 
            </InfoItem>
          </div>
        </div>

        <div class="col-span-full md:col-span-4 md:col-start-7 lg:col-span-4 lg:col-start-9 flex flex-col gap-8">
          <div class="flex flex-col h-16 justify-center">
              <span class="uppercase text-current/50 text-sm">Countdown to the draw</span>
              <span class="inline-flex items-center gap-2">
                <Show when={state.state=="ready"} fallback="--:--:--">
                  <Countdown class="text-xl" end={state()&&state()?.ts_latest_draw} />
                  <Show when={draw_locker()}>
                    <Icon icon="iconoir:lock"></Icon>
                  </Show>
                </Show>
              </span>
              
          </div>
          <div class="flex flex-col justify-between flex-1 gap-4">
            <div class="text-current/50 text-sm">New bets extend the draw by <b class="text-base-content">24</b> hours until the wagers hit <b class="text-base-content">${toBalanceValue(state()?.wager_limit,6,1)}</b>. Matching bets share the reward. If no match, the last bettor takes all. <a target="_blank" href="https://docs.aolotto.com/en" class="inline-flex items-center">Learn more<Icon icon="ei:external-link"></Icon></a></div>
            <div>
              <button 
                class="btn btn-xl btn-primary"
                disabled={state.loading}
                use:walletConnectionCheck={()=>_numpicker.open()}
              >
                <span class="inline-flex gap-4"><span>Pick and bet</span> <kbd class="kbd">P</kbd></span>
              </button>
            </div>
            <div
              class="inline-flex items-center gap-2 py-2"
            >
              <span class="text-current/50 uppercase">Price: </span><Show when={price()} fallback="...">{toBalanceValue(price(),currency?.denomination||6,1)}</Show> <span class="text-current/50"><Ticker>{currency?.ticker || pool?.asset_bet?.[0]}</Ticker>/bet</span> 
              {/* <span class="text-current/50 inline-flex items-center gap-2"><Icon icon="iconoir:arrow-right"></Icon> rebate</span> 23.00 <span class="text-current/50">$ALT</span> */}
            </div>
            </div>

          </div>
          
      </section>

      <Show when={mine()}>
        <section class="response_cols py-8 border-t border-current/20 flex justify-center items-center">
          <span class="inline-flex bg-third text-third-content px-2 uppercase rounded-full py-0.5 items-center gap-1">Bet2Earn<Icon icon="carbon:information"></Icon></span> 
          <span class="text-current/50">Remaining quota of <span class="text-base-content"><Show when={!mine.loading} fallback="...">{toBalanceValue(mine()?.quota?.[0],agent.denomination||12,2)}</Show></span>
           /{toBalanceValue(mine()?.quota?.[1],agent.denomination||12,2)} $LOTTO in this round. Next ticket mining reward: <span class="text-base-content">{toBalanceValue(mine()?.quota?.[0] / 2100,agent.denomination||12,2)}</span> $LOTTO/bet</span>
        </section>
      </Show>
      
      <Bets 
        id={pool.id}
        classList={{
          "opacity-20":isPending(),
          "opacity-100":!isPending()
        }}
        onXNumberClick={(v)=>{
          console.log(v)
          if(v?.length == pool.digits){
            _numpicker.open(v)
          }
        }}
      />
    </main>

    <Numpicker 
      ref={_numpicker} 
      state={state()}
      digits={pool?.digits&&Number(pool.digits)}
      onSubmitted={(res)=>{
        batch(()=>{
          refetchPoolState()
          refetchPoolStats()
          refetchMine()
        })
        start(()=>refetchBets())
      }}
    />

    {/* <Numbers/> */}

    </>
  )
}