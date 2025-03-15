import { createEffect, createMemo, createSignal, Match, onMount, Show, Suspense, Switch } from "solid-js"
import { Tabs } from "../../components/tabs"
import { app ,protocols } from "../../data/info"
import { shortStr,toBalanceValue } from "../../lib/tool"
import { Icon } from "@iconify-icon/solid"
import Minings from "./minings"
import Dividends from "./dividends"
import Buybacks from "./buybacks"
import Spinner from "../../components/spinner"
import { useSearchParams } from "@solidjs/router"
import { holders,supply } from "../../data/resouces"
import { setDictionarys,t,locale } from "../../i18n"

export default props => {
  const pay_i = protocols?.details[protocols.pay_id]
  const agent_i = protocols?.details[protocols.agent_id]
  setDictionarys("en",{
    "slogan" : "The glue of the community shapes LottoFi's future",
    "desc" : ()=> <span>90% of $ALT is issued to the community via the <a href="https://docs.aolotto.com/en/usdalt#bet2mint" target="_blank" class="inline-flex text-base-content items-center">Bet2Mint<Icon icon="ei:external-link"></Icon></a> mechanism, 10% is rewarded to early users via the <a href="https://docs.aolotto.com/en/faucet" target="_blank" class="inline-flex text-base-content items-center">faucet<Icon icon="ei:external-link"></Icon></a> as minting Buff (ALTb), and 100% of the protocol's profits are used for dividends and buyback.</span>,
    "l.holders" : "Holders",
    "l.circulation" : "Circulation",
    "l.dividends" : "Dividends",
    "l.buyback" : "Buyback&Burn",
    "a.learn_more" : "Learn more",
    "a.mintings" : "Mintings",
    "a.dividends" : "Dividends",
    "a.buybacks" : "Buybacks",
  })
  setDictionarys("zh",{
    "slogan" : "社區的潤滑劑塑造LottoFi的未來",
    "desc" : ()=> <span>90%的$ALT透過<a href="https://docs.aolotto.com/cn/usdalt#bet2mint" target="_blank" class="inline-flex text-base-content items-center">Bet2Mint<Icon icon="ei:external-link"></Icon></a>機制向社群發行，10%透過<a href="https://docs.aolotto.com/cn/usdalt#shui-long-tou" target="_blank" class="inline-flex text-base-content items-center">水龍頭<Icon icon="ei:external-link"></Icon></a>以鑄幣Buff(ALTb)獎勵早期用戶，協議盈收100%用於分紅和回購銷毀。</span>,
    "l.holders" : "持有者",
    "l.circulation" : "循环流通",
    "l.dividends" : "分红",
    "l.buyback" : "回购销毁",
    "a.learn_more" : "了解更多",
    "a.mintings" : "铸币",
    "a.dividends" : "分红",
    "a.buybacks" : "回购销毁",
  })
  
  const tabs = createMemo(()=>[{
    label: ()=>t("a.mintings"),
    key: "mintings"
  },{
    label:()=> t("a.dividends"),
    key: "dividends"
  },{
    label:()=> t("a.buybacks"),
    key: "buybacks"
  }])
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab,setTab] = createSignal(tabs()[0])
  onMount(()=>{
    if(searchParams?.tab){
      const idx = tabs()?.findIndex((item)=>item.key===searchParams.tab)
      setTab(tabs()?.[Math.max(idx,0)])
    }
  })

  createEffect(()=>console.log(locale()))
  
  return(
    <main className="container">
    <section class="response_cols py-16">
      <div class="col-start-auto col-span-1 sm:col-span-6 md:col-span-5 lg:col-span-8 flex flex-col gap-4">
        <div class="flex gap-4 items-center">
          <image src={`https://arweave.net/${agent_i?.Logo}`} class="size-12 rounded-full inline-flex"/>
          <span class="text-current/50">${agent_i?.Ticker} - <a href={`${app.ao_link_url}/#/token/${protocols?.agent_id}`} target="_blank" class="inline-flex items-center">AoLottoToken <Icon icon="ei:external-link"></Icon></a></span>
        </div>
        <p class="text-4xl sm:text-5xl lg:text-6xl text-balance leading-16">          
        {t("slogan")}
        </p>
      </div>
      <div class="col-start-auto col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex flex-col gap-4">
        <div class="h-12 flex w-full items-center gap-2">
          <span class="text-current/50 uppercase">{t("l.circulation")}: </span> 
          <span><Show when={!supply.loading} fallback="...">{toBalanceValue(supply(),agent_i?.Denomination)}</Show> </span> 
          <span class="text-current/50">/ 210000000 ${agent_i?.Ticker}</span>
        </div>
        <p class="text-current/50 ">
       {t("desc")}
        </p>
        <a class="inline-flex items-center" href={`https://docs.aolotto.com/${locale()=="en"?'en':'cn'}/usdalt`} target="_blank">
          {t("a.learn_more")} <Icon icon="ei:external-link"></Icon>
        </a>
      </div>
    </section>

    <Tabs
      items={tabs()}
      current={()=>tab()||tabs()?.[0]}
      onSelected={({index,item})=>{
        setTab(item)
        setSearchParams({tab:item.key})
      }}
    />
    <Suspense fallback={<Spinner className="w-full h-40 flex items-center justify-center"/>}>
      <Switch>
        <Match when={tab()?.key=="mintings"}><Minings/></Match>
        <Match when={tab()?.key=="dividends"}><Dividends/></Match>
        <Match when={tab()?.key=="buybacks"}><Buybacks/></Match>
      </Switch>
    </Suspense>
    
    </main>
  )
}