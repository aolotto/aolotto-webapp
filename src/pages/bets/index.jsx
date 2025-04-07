import { Suspense, ErrorBoundary, createResource,Show, Switch, Match, createSignal, onMount, onCleanup} from "solid-js"
import { useApp } from "../../data"
import { Icon } from "@iconify-icon/solid"
import Spinner from "../../compontents/spinner"
import { toBalanceValue } from "../../lib/tools"
import { createSocialShare, TWITTER }  from "@solid-primitives/share";
import { setDictionarys, t } from "../../i18n"
import { Datetime } from "../../compontents/moment"
import { InfoItem } from "../../compontents/infoitem"
import Numpicker from "../../compontents/numpicker"
import { useWallet } from "arwallet-solid-kit"
import { createTable } from "../../compontents/dataview"
import BetDetail from "../../compontents/betdetail"
import { Xnumbers } from "../../compontents/xnumber"
import Mint from "./mint"
import Tickets from "./tickets"


export default props => {
  let _numpicker
  let _kbd_p_event
  let _ticket
  const { agent_stats ,refetchAgentStats} = useApp()
  const [bets] = createResource(()=>[{
    "round": 7,
    "token": {
        "denomination": "6",
        "ticker": "wUSDC",
        "id": "7zH9dlMNoxprab9loshv3Y7WG45DOny_Vrq9KrXObdQ"
    },
    "count": 1,
    "player": "hR3NupY730DLbVVY9Khp-JZUFt6Z1IVXkAMrVTcPBEs",
    "x_numbers": "741",
    "price": "1000000",
    "created": 1743816692364,
    "mint": {
        "denomination": "12",
        "ticker": "ALT",
        "speed": "0.99058582065919",
        "mint_tax_rate": "0.2",
        "total": "17216444517836",
        "amount": "13773155614269",
        "plus": [
            137670123371570,
            8
        ],
        "unit": "1.7216444517837e+14",
        "token": "3IYRZBvph5Xx9566RuGWdLvUHnOcG8cHXT95s1CYRBo"
    },
    "amount": 1000000,
    "id": "jIsetGXU4ZIkTZGXHt6sufciC-c2JjiU8S_YeKr91M4"
}])
  setDictionarys("en",{
    "s.start" : "Started at ",
  })
  setDictionarys("zh",{
    "s.start" : "開始於 ",
  })
  const [pool] = createResource(()=>new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve({
        round : 1,
        ts_round_start : Date.now(),
        jackpot : 200000000,
        run : 1
      })
    },5000)
  }))
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
  })
  onCleanup(()=>{
    document.removeEventListener("keydown",_kbd_p_event)
  })

  const { Table } = createTable({
    columns: [
      {
        title: 'Player',
        key: 'player', // accessor is the "key" in the data
        cell: (v) => {
          return <div class="flex items-center tracking-tight">cY-3Rb...osDbS78</div>;
        },
        class: 'text-left',
      },
      {
        title: 'Number',
        key: 'number',
        cell: (v) => {
          return <div class="flex items-center"><Xnumbers value="123*100" /></div>;
        },
        class: 'text-left',
      },
      {
        title: 'Bet2Mint',
        key: 'bet2mint', // accessor is the "key" in the data
        cell: (v) => {
          return <div class="flex items-center">$100 - 200.00 $ALT</div>;
        },
        class: 'text-left',
      },
      {
        title: 'Date',
        key: 'date', // accessor is the "key" in the data
        cell: (v) => {
          return <div class="flex items-center">5 days ago</div>;
        },
        class: 'text-left',
      },
    ]
  })

  return(
  <>
    <div className="container">
      {/* round state */}
      <section className="response_cols py-2 lg:py-10 overflow-visible">
        <div className=" col-span-full lg:col-span-7">
          {/* round info top */}
          <div class="h-16 flex items-center gap-4 w-full md:w-fit justify-between md:justify-normal overflow-visible">
            <span 
              class="border-2 text-xl h-10 w-14 md:h-12 md:w-16 rounded-full inline-flex items-center justify-center tooltip"
              data-tip={<Show when={!pool.loading}>{"Round "+pool()?.round}</Show>}
            >
              <Show when={!pool.loading} fallback={<Spinner size="sm"/>}>R{pool().round}</Show>
            </span>
            <span 
              class="text-current/50 uppercase text-sm">
                <Show when={!pool.loading} fallback={<div className=" skeleton w-[12em] h-[1em]"></div>}>
                  <Switch>
                    <Match when={pool().ts_round_start<=0}>NOT STARTED</Match>
                    <Match  when={pool().ts_round_start>0}>{t("s.start")} <Datetime ts={pool()?.ts_round_start} display={"date"}/></Match>
                  </Switch>
                </Show>
              </span>
      
            <button 
              className="btn btn-icon btn-ghost rounded-full btn-circle"
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
          {/* round info items for mobile */}

          <div className="flex flex-col md:hidden gap-4">
            <div className="w-full flex flex-col items-center justify-center gap-2">
              <div className="text-3xl">
                <Show when={!pool.loading} fallback={<div className="skeleton w-[6em] h-[1.2em]"></div>}>$2350.99</Show>
              </div>
              <div className="text-sm text-current/50">Progressive Jackpot</div>
            </div>
            <div className=" py-4 px-2 border-y border-current/20">
              <InfoItem label={"Pool Balance"}  className="text-sm"><Show when={!pool.loading} fallback={<div className="skeleton w-[6em] h-[0.8em]"></div>}>$2,983.81</Show></InfoItem>
              <InfoItem label={"Wager Volume"}  className="text-sm"><Show when={!pool.loading} fallback={<div className="skeleton w-[6em] h-[0.8em]"></div>}>$2,983.81</Show></InfoItem>
              <InfoItem label={"Players"}  className="text-sm"><Show when={!pool.loading} fallback={<div className="skeleton w-[3em] h-[0.8em]"></div>}>123</Show></InfoItem>
              <InfoItem label={"Tickets"}  className="text-sm"><Show when={!pool.loading} fallback={<div className="skeleton w-[3em] h-[0.8em]"></div>}>2356</Show></InfoItem>
              <InfoItem label={"Draw Time"}  className="text-sm"><Show when={!pool.loading} fallback={<div className="skeleton w-[12em] h-[0.8em]"></div>}>02/04/2025, 20:48:05</Show></InfoItem>
            </div>
          </div>

          {/* round info items for desktop */}

          <div className=" flex-col hidden md:col-span-6 lg:col-span-7 md:flex mt-4">
            <InfoItem label={"Progressive Jackpot"} ><div className="text-3xl mb-4"><Show when={!pool.loading} fallback={<div className="skeleton w-[6em] h-[1.2em]"></div>}>$2,983.81</Show></div></InfoItem>
            <InfoItem label={"Pool Balance"} ><Show when={!pool.loading} fallback={<div className="skeleton w-[6em] h-[1em]"></div>}>$2,983.81</Show></InfoItem>
              <InfoItem label={"Wager Volume"}  ><Show when={!pool.loading} fallback={<div className="skeleton w-[6em] h-[1em]"></div>}>$2,983.81</Show></InfoItem>
              <InfoItem label={"Players"} ><Show when={!pool.loading} fallback={<div className="skeleton w-[3em] h-[1em]"></div>}>84</Show></InfoItem>
              <InfoItem label={"Tickets"} ><Show when={!pool.loading} fallback={<div className="skeleton w-[3em] h-[1em]"></div>}>84</Show></InfoItem>
              <InfoItem label={"Draw Time"} ><Show when={!pool.loading} fallback={<div className="skeleton w-[12em] h-[1em]"></div>}>02/04/2025, 16:26:13</Show></InfoItem>
          </div>
        </div>
        <div className="col-span-full flex flex-col lg:justify-between lg:col-span-4 lg:col-start-9 py-2 lg:py-0 gap-4 lg:gap-6">
          
            <div className="flex justify-center flex-col items-center lg:items-start ">
              <div className="text-current/50 uppercase text-sm md:text-md">countdown to draw</div>
              <div className="text-xl"><Show when={!pool.loading} fallback={<div className="skeleton w-[6em] h-[1.2em]"></div>}>23:00:00</Show></div>
            </div>
            <div className="flex-1 flex flex-col md:justify-between">
            <div className="text-sm text-center md:text-left text-current/50">New bets extend the draw by 24 hours from the time placed, until the wagers reach $2,033.3. Matching bets share the jackpot; If no match, the last bettor takes all.👉 Rules</div>
            <div className="py-4 px-2 md:px-0">
              <button className="btn btn-primary btn-xl w-full md:w-fit rounded-2xl" use:walletConnectionCheck={()=>_numpicker.open()}>Pick and bet <span className="kbd text-primary">P</span></button>
            </div>
            <div className="text-center md:text-left">Price : $1 / bet</div>
          </div>
        </div>
      </section>
      {/* mints */}
      <Mint/>
      {/* bets */}
      <section className=" py-4 text-center text-sm lg:text-base">
      👇 If no more bets, 43.69% (🍕~$665.76) of the jackpot goes to the last bettor, 56.31% to the winners.

      </section>
      <section>
        <Tickets/>
      </section>
      <section>
        <button className="btn" onClick={()=>_ticket?.open({id:"12345"})}>show detail</button>
      </section>
    </div>

    {/* <div className=" fixed bottom-0 md:invisible w-full box-border z-1 bg-base-100 pb-safe border-t border-current/20 hidden">
      <div className="flex justify-between p-4 ">
        <div>
          <div className="text-xs uppercase text-current/50">Price</div>
          <div>1 $wUSDC/bet</div>
        </div>
        <div>
          <button className="btn btn-primary" onClick={()=>refetchAgentStats()}>Pick and Bet</button>
        </div>
      </div>
    </div> */}
    <Numpicker ref={_numpicker} id="numpicker"/>
    <BetDetail id="ticket" ref={_ticket}/>
  </>
  )
}