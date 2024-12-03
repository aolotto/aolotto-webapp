import { Tabs } from "../../components/tabs"
import tooltip from "../../components/tooltip"
import Bettings from "./bettings"
import Winnings from "./winnings"
import Minings from "./minings"
import Dividends from "./dividends"
import { createSignal, Match, onMount, Suspense, Switch } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { InfoItem } from "../../components/infoitem"

export default props => {
  const tabs = [{
    label:"Top Bettings",
    key:"bet"
  },{
    label:"Top Winnings",
    key:"win"
  },{
    label:"Top Minings",
    key:"mine"
  },{
    label:"Top Dividends",
    key:"div"
  }]
  const [tab,setTab] = createSignal()
  onMount(()=>{
    setTab(tabs[0])
  })
  return(
    <main class="container">
      <section class="response_cols py-8">
        <div class="col-span-full sm:col-span-3 md:col-span-5 lg:col-span-7 p-3 flex flex-col justify-between">
          <InfoItem label={"🎟️ Total Betting"}>230.000 $wUSDC</InfoItem>
          <InfoItem label={"🏆 Total Winning"}>230.000 $wUSDC</InfoItem>
          <InfoItem label={"👷 Total Mining"}>230.000 $LOTTO</InfoItem>
          <InfoItem label={"💰 Total Dividends"}>230.000 $wUSDC</InfoItem>
          {/* <div class="text-current/50">BETTNG($)</div>
          <div class="text-xl">2300.00</div>
          <div class="flex flex-col gap-1 mt-3">
            <div class="text-sm">200 <span class="text-current/50">tickets</span></div>
            <div class="text-sm">2 <span class="text-current/50">players</span></div>
          </div> */}
        </div>
        <div class="col-span-full sm:col-span-3 md:col-span-4 lg:col-span-4 lg:col-end-13 p-2 leading-6 text-sm">
        The lottery pool has completed 10 rounds, with 200 players purchasing 2,000 tickets. A total of $3,000 in taxes has been collected, and $300 in dividends distributed to 20 $LOTTO holders.
        </div>
        
      </section>
      <section class="response_cols">
        <div class="col-span-full">
          <Tabs 
            items={tabs}
            current = {tab()||tabs[0]}
            onSelected={({index,item})=>setTab(item)}
          />
        </div>
      </section>
      <div>
      <Suspense fallback="loading...">
        <Switch>
          <Match when={tab()?.key == "bet"}><Bettings/></Match>
          <Match when={tab()?.key == "win"}><Winnings/></Match>
          <Match when={tab()?.key == "mine"}><Minings/></Match>
          <Match when={tab()?.key == "div"}><Dividends/></Match>
          {/* <Match when={tab()?.key == "bet"}><Bettings/></Match> */}
        </Switch>
      </Suspense>
        
      </div>
      
    </main>
  )
}