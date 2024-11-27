import { Tabs } from "../../components/tabs"
import tooltip from "../../components/tooltip"
import Bettings from "./bettings"
import Winnings from "./winnings"
import Minings from "./minings"
import Dividends from "./dividends"
import { createSignal, Match, onMount, Suspense, Switch } from "solid-js"

export default props => {
  const tabs = [{
    label:"Bettings",
    key:"bet"
  },{
    label:"Winnings",
    key:"win"
  },{
    label:"Minings",
    key:"mine"
  },{
    label:"Dividends",
    key:"div"
  }]
  const [tab,setTab] = createSignal()
  onMount(()=>{
    setTab(tabs[0])
  })
  return(
    <main class="container">
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