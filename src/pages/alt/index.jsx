import { createSignal, Match, Suspense, Switch } from "solid-js"
import { Tabs } from "../../components/tabs"
import { agent, app } from "../../signals/global"
import { shortStr } from "../../lib/tool"
import { Icon } from "@iconify-icon/solid"
import Minings from "./minings"
import Dividends from "./dividends"
import Spinner from "../../components/spinner"

export default props => {
  const tabs = [{
    label: "Minings",
    key: "minings"
  },{
    label: "Dividends",
    key: "dividends"
  },{
    label: "Quotas",
    key: "quotas"
  }]
  const [tab,setTab] = createSignal(tabs[0])
  return(
    <main className="container">
    <section class="response_cols py-8">
      <div class="col-start-auto col-span-1 sm:col-span-6 md:col-span-5 lg:col-span-8 flex flex-col gap-4">
        <div class="flex gap-2 items-center">
          <image src="https://arweave.net/3u9Hr7xL02QjVikyY7i3o7ZiRMdoJqr3eQDzT6SOz1s" class="size-12 rounded-full inline-flex"/>
          <span class="text-current/50">$LOTTO</span>
        </div>
        <p class="text-4xl sm:text-5xl lg:text-6xl">          
          The profit-sharing token of the Aolotto ecosystem.
        </p>
      </div>
      <div class="col-start-auto col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex flex-col gap-4">
        <div class="h-12 flex w-full md:flex-col">
          <a href={`${app.ao_link_url}/#/token/${agent.id}`} target="_blank" class="items-center">{shortStr(agent?.id,8)}<Icon icon="ei:external-link"></Icon></a>
        </div>
        <p class="text-current/50 ">
        Holding $LOTTO allows you to continuously share in the profits. 70% of the total supply of 21 million will be earned for free through the #Bet2Earn mechanism.
        </p>
        <a class="btn w-fit rounded-full inline-flex items-center btn-primary" href="">Learn more <Icon icon="iconoir:arrow-right"></Icon></a>
      </div>
    </section>
    <section class="response_cols pb-8">
      <div class="col-span-full lg:col-span-4 p-1">
        <div class="text-current/50 uppercase">Current Holders</div>
        <div class="text-lg">23</div>
      </div>
      <div class="col-span-full lg:col-span-4 p-1">
        <div class="text-current/50 uppercase">Total Supply ($LOTTO)</div>
        <div class="text-lg">23.00</div>
      </div>
      <div class="col-span-full lg:col-span-4 p-1">
        <div class="text-current/50 uppercase ">Total Dividends ($wUSDC)</div>
        <div class="text-lg">23.00</div>
      </div>
    </section>
    <Tabs
      items={tabs}
      current={tab()||tabs[0]}
      onSelected={({index,item})=>setTab(item)}
    />
    <Suspense fallback={<Spinner/>}>
      <Switch>
        <Match when={tab()?.key=="minings"}><Minings/></Match>
        <Match when={tab()?.key=="dividends"}><Dividends/></Match>
      </Switch>
    </Suspense>
    
    </main>
  )
}