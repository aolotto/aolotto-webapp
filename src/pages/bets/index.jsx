import { Suspense, ErrorBoundary, createResource,Show, Switch, Match, createSignal} from "solid-js"
import { useApp } from "../../data"
import { Icon } from "@iconify-icon/solid"
import Spinner from "../../compontents/spinner"
import { toBalanceValue } from "../../lib/tools"
import { createSocialShare, TWITTER }  from "@solid-primitives/share";
import { setDictionarys, t } from "../../i18n"
import { Datetime } from "../../compontents/moment"
import { InfoItem } from "../../compontents/infoitem"

export default props => {
  const {address} = useApp()
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
        jackpot : 200000000
      })
    },5000)
  }))
  const [shareData,setShareData] = createSignal({
    title: "Aolotto",
    url: "https://aolotto.com",
  })
  const [share, close] = createSocialShare(() => shareData());
  return(
  <>
    <div className="container">
      {/* round state */}
      <section className="response_cols py-4 lg:py-10 overflow-visible">
        <div className=" col-span-full lg:col-span-7">
          {/* round info top */}
          <div class="h-16 flex items-center gap-4 w-full md:w-fit justify-between md:justify-normal overflow-visible">
            <span 
              class="border-2 text-xl h-10 w-14 md:h-12 md:w-16 rounded-full inline-flex items-center justify-center tooltip"
              // data-tip={"Round "+pool()?.round}
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
              <div className="text-3xl">$2350.99</div>
              <div className="text-sm text-current/50">Progressive Jackpot</div>
            </div>
            <div className=" py-4">
              <InfoItem label={"Pool Balance"}  className="text-sm">$2,983.81</InfoItem>
              <InfoItem label={"Wager Volume"}  className="text-sm">$2,983.81</InfoItem>
              <InfoItem label={"Participation"}  className="text-sm">84 players / 758 tickets</InfoItem>
              <InfoItem label={"Pool Balance"}  className="text-sm">$2,983.81</InfoItem>
            </div>
          </div>

          {/* round info items for disktop */}
          <div className=" hidden lg:flex flex-col"></div>
        </div>
        <div className="col-span-full lg:col-span-4 lg:col-start-9">
         <div>
          <div className="flex justify-center gap-2">
            <div className="text-current/50 uppercase">countdown to draw</div>
            <div>23:00:00</div>
          </div>
          <div className="text-sm text-center mt-4">New bets extend the draw by 24 hours from the time placed, until the wagers reach $2,033.3. Matching bets share the jackpot; If no match, the last bettor takes all.👉 Rules</div>
          <div>
            <button className="btn btn-primary btn-xl w-full">Pick and bet</button>
          </div>
         </div>
        </div>
      </section>
      {/* bets */}
      <section className="h-20"></section>
    </div>

    <div className=" fixed bottom-0 md:invisible w-full box-border z-1 bg-base-100 pb-safe border-t border-current/20">
      <div className="flex justify-between p-4 ">
        <div>
          <div className="text-xs uppercase text-current/50">Price</div>
          <div>1 $wUSDC/bet</div>
        </div>
        <div>
          <button className="btn btn-primary">Pick and Bet</button>
        </div>
      </div>
    </div>
  </>
  )
}