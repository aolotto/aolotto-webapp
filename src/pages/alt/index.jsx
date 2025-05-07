import { createEffect, createMemo, createResource, Suspense, createSignal, onMount } from "solid-js";
import { useApp } from "../../contexts";
import { fetchPrice,fetchSupply } from "../../api";
import Skeleton from "../../compontents/skeleton";
import { Icon } from "@iconify-icon/solid";
import { t, setDictionarys,locale } from "../../i18n";
import { toBalanceValue } from "../../lib/tools";
import Mintings from "./mintings";
import Stakings from "./stakings";
import Burnings from "./burnings";
import Unstakes from "./unstakes";
import { useSearchParams } from "@solidjs/router";
import Tabs from "../../compontents/tabs";
import Spinner from "../../compontents/spinner";

export default function ALT() {
  setDictionarys("en",{
    "slogan" : "The glue of the community shapes LottoFi's future",
    "desc" : ()=> <span>210M $ALT is issued to the community via the <a href="https://docs.aolotto.com/en/usdalt#bet2mint" target="_blank" class="inline-flex text-base-content items-center">Bet2Mint<Icon icon="ei:external-link"></Icon></a> mechanism, 10% is rewarded to early users via the <a href="https://docs.aolotto.com/en/faucet" target="_blank" class="inline-flex text-base-content items-center">faucet<Icon icon="ei:external-link"></Icon></a> as minting Buff (ALTb), and 100% of the protocol's profits are used for dividends and buyback.</span>,
    "l.holders" : "Holders",
    "l.circulation" : "Circulation",
    "l.price" : "Price",
    "l.dividends" : "Dividends",
    "l.buyback" : "Buyback&Burn",
    "a.learn_more" : "Learn more",
    "a.mints" : "Mints",
    "a.burns" : "Burns",
    "a.stakes" : "Stakes",
    "a.unstakes" : "Unstakes",
    "a.dividends" : "Dividends",
    "a.buybacks" : "Buybacks",
  })
  setDictionarys("zh",{
    "slogan" : "社區的潤滑劑塑造LottoFi的未來",
    "desc" : ()=> <span>2.1亿$ALT透過<a href="https://docs.aolotto.com/cn/usdalt#bet2mint" target="_blank" class="inline-flex text-base-content items-center">Bet2Mint<Icon icon="ei:external-link"></Icon></a>機制向社群發行，10%透過<a href="https://docs.aolotto.com/cn/usdalt#shui-long-tou" target="_blank" class="inline-flex text-base-content items-center">水龍頭<Icon icon="ei:external-link"></Icon></a>以鑄幣Buff(ALTb)獎勵早期用戶，協議盈收100%用於分紅和回購銷毀。</span>,
    "l.holders" : "持有者",
    "l.circulation" : "当前流通",
    "l.price" : "价格",
    "l.dividends" : "分红",
    "l.buyback" : "回购销毁",
    "a.learn_more" : "了解更多",
    "a.mints" : "铸币",
    "a.burns" : "销毁",
    "a.stakes" : "质押",
    "a.unstakes" : "解锁",
    "a.dividends" : "分红",
    "a.buybacks" : "回购销毁",
  })
  const tabs = createMemo(()=>[{
    label: ()=>t("a.mints"),
    key: "mints"
  },{
    label:()=> t("a.burns"),
    key: "burns"
  },{
    label:()=> t("a.stakes"),
    key: "stakes"
  },{
    label:()=> t("a.unstakes"),
    key: "unstakes"
  }])
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab,setTab] = createSignal(tabs()[0])
  onMount(()=>{
    if(searchParams?.tab){
      const idx = tabs()?.findIndex((item)=>item.key===searchParams.tab)
      setTab(tabs()?.[Math.max(idx,0)])
    }
  })
  const {info, agentProcess} = useApp();
  const [price] = createResource(() => info?.swap_process || import.meta.env.VITE_ALT_WUSDC_PROCESS, fetchPrice);
  const [supply] = createResource(() => info?.agent_process || import.meta.env.VITE_AGENT_PROCESS, fetchSupply);

  return (
    <main className="container">
      <section class="response_cols py-8 md:py-10 lg:py-16">
        <div class="col-start-auto col-span-full md:col-span-5 lg:col-span-8 flex flex-col  gap-4">
          <div class="flex gap-4 items-center w-full justify-center md:justify-start">
            <image src={agentProcess.state=="ready"&&`https://arweave.net/${agentProcess()?.Logo}`} class="size-12 rounded-full inline-flex"/>
            <span class="text-current/50">${agentProcess.state=="ready"&&agentProcess()?.Ticker} - <a href={`${info.ao_link_url}/#/token/${info?.agent_process}`} target="_blank" class="inline-flex items-center">AoLottoToken <Icon icon="ei:external-link"></Icon></a></span>
          </div>
          <p class=" text-center md:text-left text-4xl sm:text-5xl lg:text-6xl text-balance">          
          {t("slogan")}
          </p>
        </div>
        <div class="col-start-auto col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex flex-col items-center md:items-start gap-4">
          <div class=" flex w-full items-center gap-6 md:gap-8 justify-center md:justify-start border-y border-base-300 py-2 md:py-0 md:border-none">
    
            <div className="flex gap-2 items-center md:items-start justify-center ">
              <span class="text-current/50 ">{t("l.circulation")}:</span> 
              <span class=""><Show when={!supply.loading} fallback={<Skeleton w={4} h={1}/>}>{toBalanceValue(supply(),12)}</Show> </span> 

            </div>
            
          </div>
          <p class="text-current/50  text-center md:text-left">
            {t("desc")}
          </p>
          <a class="inline-flex items-center" href={`https://docs.aolotto.com/${locale()=="en"?'en':'cn'}/usdalt`} target="_blank">
            {t("a.learn_more")} <Icon icon="ei:external-link"></Icon>
          </a>
        </div>
      </section>
      <section className="flex  items-center gap-4 justify-center pb-6 lg:pb-10">
        <p className="flex items-center gap-2">
          <span className="text-current/50">Current price:</span>
          <b><Show when={!price.loading} fallback={<Skeleton w={4} h={1}/>}>${price()?.toFixed(5)}</Show> </b>
        </p>
        <a href="https://www.permaswap.network/#/ao/7zH9dlMNoxprab9loshv3Y7WG45DOny_Vrq9KrXObdQ%263IYRZBvph5Xx9566RuGWdLvUHnOcG8cHXT95s1CYRBo?tab=swap" target="_blank" className="flex items-center gap-1">
          <span>Swap</span>
          <Icon icon="ei:external-link"></Icon>
        </a>

      </section>
      <section>
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
            <Match when={tab()?.key=="mints"}><Mintings/></Match>
            <Match when={tab()?.key=="stakes"}><Stakings/></Match>
            <Match when={tab()?.key=="burns"}><Burnings/></Match>
            <Match when={tab()?.key=="unstakes"}><Unstakes/></Match>
          </Switch>
        </Suspense>
            
      </section>
    </main>
  );
}