import { Tabs } from "../../components/tabs"
import tooltip from "../../components/tooltip"
import Bettings from "./bettings"
import Winnings from "./winnings"
import Minings from "./minings"
import Dividends from "./dividends"
import { createSignal, Match, onMount, Suspense, Switch } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { InfoItem } from "../../components/infoitem"
import Spinner from "../../components/spinner"

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
    <main class="container py-8">
      {/* <section class="response_cols py-12">
        <div class="col-span-3 bg-current/5 p-6 gap-2 flex-col flex rounded-xl">
          <div class="text-current/50 uppercase">Bettings ($wUSDC)</div>
          <div class="text-2xl">2345.00</div>
          <div class="text-current/50 text-sm">2 Players / 20 Tickets</div>
        </div>
        <div class="col-span-3 bg-current/5 p-6 gap-2 flex-col flex rounded-xl">
          <div class="text-current/50 uppercase">Mininigs ($ALT)</div>
          <div class="text-2xl">2345.00</div>
          <div class="text-current/50 text-sm">2 Rounds / 2 minners</div>
        </div>
        <div class="col-span-3 bg-current/5 p-6 gap-2 flex-col flex rounded-xl">
          <div class="text-current/50 uppercase">Winnings ($wUSDC)</div>
          <div class="text-2xl">2345.00</div>
          <div class="text-current/50 text-sm">2 Winners / 2 Rounds</div>
        </div>
        <div class="col-span-3 bg-current/5 p-6 gap-2 flex-col flex rounded-xl">
          <div class="text-current/50 uppercase">Divedends ($wUSDC)</div>
          <div class="text-2xl">2345.00</div>
          <div class="text-current/50 text-sm">200 Holders</div>
        </div>
      </section> */}
      {/* <section class="response_cols ">
        <div class="col-span-full">
          <Tabs 
            before={<div class="text-current/50"></div>}
            items={tabs}
            current = {tab()||tabs[0]}
            onSelected={({index,item})=>setTab(item)}
            after={<div class="text-current/50"></div>}
          />
        </div>
      </section> */}
      <div>
      <Suspense fallback={<div className="w-full h-40 flex flex-col items-center justify-center"><Spinner/></div>}>
      
      <Bettings/>
      {/* <h2 class="text-current/50 uppercase border-b border-current/10 ">top Bettings</h2> */}
      <Winnings/>
      {/* <h2 class="text-current/50 uppercase border-b border-current/10 ">top Bettings</h2> */}
      <Minings/>
      <Dividends/>
        {/* <Switch>
          <Match when={tab()?.key == "bet"}><Bettings/></Match>
          <Match when={tab()?.key == "win"}><Winnings/></Match>
          <Match when={tab()?.key == "mine"}><Minings/></Match>
          <Match when={tab()?.key == "div"}><Dividends/></Match>
        </Switch> */}
      </Suspense>
        
      </div>
      
    </main>
  )
}