import { Copyable } from "../../components/copyable"
import Avatar from "../../components/avatar"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Icon } from "@iconify-icon/solid"
import { Tabs } from "../../components/tabs"
import { batch, createEffect, createMemo, createSignal, Match, onMount, Show, Suspense, Switch } from "solid-js"
import { InfoItem } from "../../components/infoitem"
import tooltip from "../../components/tooltip"
import { connected,handleConnection,handleDisconnection,address } from "../../components/arwallet"
import { protocols } from "../../signals/global"
import { createPlayerAccount,balances,refetchUserBalances } from "../../signals/player"
import Ticker from "../../components/ticker"
import Tickets from "./tickets"
import Rewards from "./rewards"
import Claims from "./claims"
import Dividends from "./dividends"
import Mintings from "./mintings"
import Spinner from "../../components/spinner"
import { Claimer } from "../../components/claimer"
import toast from "solid-toast"
import { useSearchParams } from "@solidjs/router"
import { setDictionarys,t } from "../../i18n"



export default props=>{
  let _claimer
  
  const [account,{refetch:refetchAccount}] = createPlayerAccount(()=>({player:address(),id:protocols?.agent_id}))
  const [searchParams, setSearchParams] = useSearchParams();
  const pay_i = protocols?.details[protocols.pay_id]
  const agent_i = protocols?.details[protocols.agent_id]
  

  setDictionarys("en",{
    "label.tickets" : "Tickets",
    "label.bet": "Total Bet",
    "label.win": "Total Win",
    "label.mint": "Total Mint",
    "label.dividends": "Dividends",
    "action.claim": "Claim",
    "action.disconnect": "Disconnect",
    "action.deposit": "Deposit",
    "action.swap": "Swap",
    "m.bets": "Bets",
    "m.mints": "Mintings",
    "m.wins": "Wins",
    "m.dividends": "Dividends",
    "m.claims": "Claims"
  })
  setDictionarys("zh",{
    "label.tickets" : "彩券",
    "label.bet": "累計投注",
    "label.win": "累計獲獎",
    "label.mint": "累計鑄幣",
    "label.dividends": "分紅",
    "action.claim": "領獎",
    "action.disconnect": "斷開",
    "action.deposit": "儲值",
    "action.swap": "兌換",
    "m.bets": "投注",
    "m.mints": "鑄幣",
    "m.wins": "獲獎",
    "m.dividends": "分紅",
    "m.claims": "領獎"
  })

  const subMenus = createMemo(()=>[{
    label: ()=>t("m.bets"),
    key:"bets"
  },{
    label:()=>t("m.wins"),
    key:"wins"
  },{
    label:()=>t("m.mints"),
    key:"mintings"
  },{
    label:()=>t("m.dividends"),
    key:"dividends"
  },{
    label:()=>t("m.claims"),
    key: "claims"
  }])

  const [tab,setTab] = createSignal(subMenus()?.[0])

  onMount(()=>{
    if(searchParams?.tab&&subMenus()){
      const idx = subMenus().findIndex((item)=>item.key===searchParams.tab)
      setTab(subMenus()?.[Math.max(idx,0)])
    }
  })
  createEffect(()=>console.log("acount",account()))
  

  return(
  <Show when={connected()} fallback={<main class="container">welcome</main>}>
    <main class="container">
      <section class="response_cols py-8 border-b border-current/10 ">
        <div class="col-span-full flex justify-between">
          <div class="inline-flex items-center gap-4">
            <Avatar username={address()} class="size-8"></Avatar>
            <span>
              <Copyable value={address()}>{shortStr(address(),6)}</Copyable>
            </span>
          </div>
          <div class="flex gap-4 items-center">
            <span className="text-current/50">{t("action.disconnect")}</span>
            <button 
              class="btn btn-icon rounded-full btn-ghost"
              onClick={handleDisconnection}
            >
              <Icon icon="solar:logout-outline"></Icon>
            </button>
          </div>
        </div>
      </section>
      
      <section class="response_cols py-8 px-1">
        <div class="col-span-full lg:col-span-7">

          <InfoItem label={t("label.tickets")}><Show when={!account.loading} fallback="...">{account()?.bet?.[2]||0}</Show></InfoItem>
          <InfoItem label={t("label.bet")}><Show when={!account.loading} fallback="...">{toBalanceValue(account()?.bet?.[1]||0,pay_i?.Denomination||6,2)}</Show> <Ticker class="text-current/50">{pay_i?.Ticker}</Ticker></InfoItem>
          <InfoItem label={t("label.win")}><Show when={!account.loading} fallback="...">{toBalanceValue(account()?.win?.[1]||0,pay_i?.Denomination||6,2)}</Show> <Ticker class="text-current/50">{pay_i?.Ticker}</Ticker></InfoItem>
          <InfoItem label={t("label.mint")}><Show when={!account.loading} fallback="...">{toBalanceValue(account()?.mint||0,agent_i?.Denomination||12,4)}</Show> <Ticker class="text-current/50">{agent_i?.Ticker}</Ticker></InfoItem>
          <InfoItem label={t("label.dividends")}><Show when={!account.loading} fallback="...">{toBalanceValue(account()?.div?.[1]||0,pay_i?.Denomination||6,2)}</Show> <Ticker class="text-current/50">{pay_i?.Ticker}</Ticker></InfoItem>
          
        </div>

        <div class="col-span-full lg:col-span-4 lg:col-end-13">
          <div class="flex items-center justify-between pb-4">
            <div class="flex items-center gap-4">
              <span class="text-3xl">🏆</span>
              <Show when={!account.loading} fallback="..."><span class="text-xl" classList={{"text-current/50": account()?.win?.[0] == 0}}>${toBalanceValue(account()?.win?.[0]||0,pay_i?.Denomination||6,2)} </span></Show>
            </div>
            <div>
              <button 
                class="btn btn-primary rounded-full" 
                disabled={account()&&Number(account()?.win?.[0])<=0}
                onClick={()=>_claimer.open()}
              >
                {t("action.claim")}
              </button>
            </div>
          </div>
          <div class="py-6 flex flex-col gap-4 ">
            <div class="flex items-center gap-2 justify-between">
              <div class="flex items-center gap-2">
                <Icon icon="ph:arrow-elbow-down-right-light"></Icon>
                <img src={`https://arweave.net/${pay_i?.Logo}`} class="size-6 rounded-full"/> 
                <span><Show when={!balances.loading} fallback="...">{toBalanceValue(balances()?.[protocols?.pay_id]||0,pay_i?.Denomination||6,2)}</Show> <Ticker class="text-current/50">{pay_i?.Ticker}</Ticker></span>
              </div>
              <div>
                <a class="inline-flex items-center" href="https://aox.xyz/#/home" target="_blank">{t("action.deposit")}<Icon icon="ei:external-link"></Icon></a>
              </div>
            </div>
            <div class="flex items-center gap-2 justify-between">
              <div class="flex items-center gap-2">
                <Icon icon="ph:arrow-elbow-down-right-light"></Icon>
                <img src={`https://arweave.net/${agent_i?.Logo}`} class="size-6 rounded-full"/> 
                <span><Show when={!balances.loading} fallback="...">{toBalanceValue(balances()?.[protocols?.agent_id]||0,agent_i?.Denomination||12,2)}</Show>  <Ticker class="text-current/50">{agent_i?.Ticker}</Ticker></span>
              </div>
              <div>
                <a class="inline-flex items-center" href="#">{t("action.swap")}<Icon icon="ei:external-link"></Icon></a>
              </div>
            </div>
          </div>
        </div>

      </section>

      <Tabs
        class="mt-0"
        items={subMenus()}
        current={tab()||subMenus()?.[0]}
        onSelected={({index,item})=>{
          setSearchParams({tab:item.key})
          setTab(item)
        }}
      />
      <Suspense fallback={<div class="w-full h-40 flex justify-center items-center"><Spinner/></div>}>
        <Switch>
          <Match when={tab()?.key=="bets"}><Tickets/></Match>
          <Match when={tab()?.key=="dividends"}><Dividends/></Match>
          <Match when={tab()?.key=="wins"}><Rewards/></Match>
          <Match when={tab()?.key=="claims"}><Claims/></Match>
          <Match when={tab()?.key=="mintings"}><Mintings/></Match>
        </Switch>
      </Suspense>
      <Claimer 
        ref={_claimer}
        rewards={account()?.win?.[0]}
        tax={account()?.tax?.[0]}
        user={address()}
        onClaimed ={(e)=>{
          toast.success("Claimed!")
          batch(()=>{
            refetchUserBalances()
            refetchAccount()
          })
        }}
      />
    </main>
  </Show>
  )
}