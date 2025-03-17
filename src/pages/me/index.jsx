import { Copyable } from "../../components/copyable"
import Avatar from "../../components/avatar"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Icon } from "@iconify-icon/solid"
import { Tabs } from "../../components/tabs"
import { batch, createEffect, createMemo, createSignal, Match, onMount, Show, Suspense, Switch } from "solid-js"
import { InfoItem } from "../../components/infoitem"
import tooltip from "../../components/tooltip"
import { connected, handleDisconnection ,address } from "../../components/wallet"
import { protocols } from "../../data/info"
import { USDC,ALT,refetchALT,refetchUSDC,player,refetchPlayer } from "../../data/resouces"
import Ticker from "../../components/ticker"
import Tickets from "./tickets"
import Rewards from "./rewards"
import Claims from "./claims"
import Dividends from "./dividends"
import Mintings from "./mintings"
import Spinner from "../../components/spinner"
import { Claimer } from "../../components/claimer"
import { useSearchParams } from "@solidjs/router"
import { setDictionarys,t } from "../../i18n"
import Welcome from "./welcome"
import { locale } from "../../i18n"
import Recharger from "../../components/recharger"
// import { createUserAntProfile } from "../../signals/player"

export default props=>{
  let _claimer
  const [searchParams, setSearchParams] = useSearchParams();
  const pay_i = protocols?.details[protocols.pay_id]
  const agent_i = protocols?.details[protocols.agent_id]
  const [activeClaim,setActiveClaim] = createSignal()
  

  setDictionarys("en",{
    "label.tickets" : "Tickets",
    "label.bet": "Bet",
    "label.win": "Win",
    "label.mint": "Mint",
    "label.dividends": "Dividend",
    "label.staking": "Stake",
    "action.claim": "Claim",
    "action.disconnect": "Disconnect",
    "action.deposit": "Deposit",
    "action.swap": "Swap",
    "m.bets": "Bets",
    "m.mints": "Mintings",
    "m.wins": "Wins",
    "m.dividends": "Dividends",
    "m.claims": "Claims",
    "m.get": "Add",
    "m.getted": "Added"
  })
  setDictionarys("zh",{
    "label.tickets" : "彩券",
    "label.bet": "累計投注",
    "label.win": "累計獲獎",
    "label.mint": "累計鑄幣",
    "label.dividends": "分紅",
    "label.staking": "质押",
    "action.claim": "領獎",
    "action.disconnect": "斷開",
    "action.deposit": "儲值",
    "action.swap": "兌換",
    "m.bets": "投注",
    "m.mints": "鑄幣",
    "m.wins": "獲獎",
    "m.dividends": "分紅",
    "m.claims": "領獎",
    "m.get": "添加",
    "m.getted": "已添加"
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
    if(player()){
      batch(()=>{
        refetchALT()
        refetchUSDC()
      })
    }
  })

  createEffect(()=>{
    if(connected()){
      const localActiveClaimsCache = localStorage.getItem("ACTIVE_CLAIM_"+address())
      console.log("localActiveClaimsCache",localActiveClaimsCache)
      if(localActiveClaimsCache){
        setActiveClaim(JSON.parse(localActiveClaimsCache))
      }
    }
    console.log(player())
  })

  return(
  <Show when={connected()} fallback={<main class="container"><Welcome/></main>}>
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
              class="btn btn-circle btn-ghost"
              onClick={handleDisconnection}
            >
              <Icon icon="solar:logout-outline"></Icon>
            </button>
          </div>
        </div>
      </section>
      
      <section class="response_cols py-8 px-1">
        <div class="col-span-full lg:col-span-7 flex flex-col justify-between">
          <InfoItem label={t("label.bet")}><Show when={player.state != "unresolved"} fallback="...">${toBalanceValue(player()?.bet?.[1]||0,pay_i?.Denomination||6,6)} <span class="text-current/50">/ {player()?.bet?.[2]||0} tickets</span> </Show> </InfoItem>
          <InfoItem label={t("label.win")}><Show when={player.state != "unresolved"} fallback="...">${toBalanceValue(player()?.win?.[1]||0,pay_i?.Denomination||6,6)} <span class="text-current/50">/ {player()?.win?.[2]||0} rounds</span></Show> </InfoItem>
          <InfoItem label={t("label.mint")}><Show when={player.state != "unresolved"} fallback="...">{toBalanceValue(player()?.mint / 0.8||0,agent_i?.Denomination||12,12)} <Ticker>{agent_i?.Ticker}</Ticker></Show></InfoItem>
          <InfoItem label={t("label.dividends")}><Show when={player.state != "unresolved"} fallback="...">${toBalanceValue(player()?.div?.[0]||0,pay_i?.Denomination||6,6)} <span class="text-current/50">/ ${toBalanceValue(player()?.div?.[1]||0,pay_i?.Denomination||6,6)}</span> </Show> </InfoItem>
          <InfoItem label={t("label.staking")}><Show when={player.state != "unresolved"} fallback="...">{toBalanceValue(player()?.stake?.[0]||0,agent_i?.Denomination||12,12)} <Ticker>{agent_i?.Ticker}</Ticker></Show></InfoItem>
          
        </div>

        <div class="col-span-full lg:col-span-4 lg:col-end-13">
          <div class="flex items-center w-full justify-between gap-6 border-b border-base-300 pb-4">
            <div class="flex-1 flex items-center justify-between">
              <div>
                <p class="text-current/50 uppercase text-xs">Unclaimed Prize</p>
                <p><Show when={player.state != "unresolved"} fallback="..."><span classList={{"text-current/50": player()?.win?.[0] == 0}}>${toBalanceValue(player()?.win?.[0]||0,pay_i?.Denomination||6,2)} </span></Show></p>
              </div>
              <button 
                class="btn btn-square"
                disabled={!player()||!player()?.win||Number(player()?.win?.[0]||0)<=0}
                onClick={()=>_claimer.open()}
              >
                <Icon icon="iconoir:send-dollars" />
              </button>
            </div>
            <div class="flex-1 flex items-center justify-between">
              <div>
                <p class="text-current/50 uppercase text-xs">Unclaimed dividends</p>
                <p><Show when={player.state != "unresolved"} fallback="..."><span classList={{"text-current/50": player()?.div?.[0] < 1}}>${toBalanceValue(player()?.div?.[0]||0,pay_i?.Denomination||6,2)} </span></Show></p>
              </div>
              <button class="btn btn-square" disabled={true}><Icon icon="iconoir:send-dollars" /></button>
            </div>
          </div>
          {/* <div class="text-sm flex flex-col gap-2">
            <div class="flex justify-between items-center"><p>🏆 $2355.00</p><button class="btn btn-sm btn-primary">Claim Prize</button></div>
            <div class="flex justify-between items-center"><p>💵 $2355.00</p><button class="btn btn-sm btn-primary">Claim Dividends</button></div>
          </div> */}
          {/* <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <span class="text-3xl">🏆</span>
              <Show when={!player.loading} fallback="..."><span class="text-xl" classList={{"text-current/50": player()?.win?.[0] == 0}}>${toBalanceValue(player()?.win?.[0]||0,pay_i?.Denomination||6,2)} </span></Show>
            </div>
            <div className="flex items-center gap-2">
            <Show when={activeClaim()}>
              <button
                className="btn rounded-full btn-sm btn-secondary"
                onClick={()=>_claimer.open()}
              >1</button>
            </Show>
              <button 
                class="btn btn-primary  rounded-full" 
                disabled={!player()||!player()?.win||Number(player()?.win?.[0]||0)<=0}
                onClick={()=>_claimer.open()}
              >
                {t("action.claim")}
              </button>
            </div>
          </div> */}
          <div class="pt-6 flex flex-col gap-4 ">
            <div class="flex items-center gap-2 justify-between">
              <div class="flex items-center gap-2">
                <Icon icon="ph:arrow-elbow-down-right-light"></Icon>
                <span class="tooltip" data-tip = "$wUSDC - warped USDC">
                  <img src={`https://arweave.net/${pay_i?.Logo}`} class="size-6 rounded-full"/>
                </span>
                <span class="text-sm"><Show when={!USDC.loading} fallback="...">{toBalanceValue(USDC()||0,pay_i?.Denomination||6,6)}</Show> </span>
              </div>
              <div>
                <Recharger/>
              </div>
            </div>
            <div 
              class="flex items-center gap-2 justify-between"
              
            >
              <div class="flex items-center gap-2">
                <Icon icon="ph:arrow-elbow-down-right-light"></Icon>
                <span class="tooltip" data-tip = "$ALT - AoLotto Token">
                  <img 
                    src={`https://arweave.net/${agent_i?.Logo}`} 
                    class="size-6 rounded-full "  
                  /> 
                </span>
                
                <span class="text-sm"><Show when={!ALT.loading} fallback="...">{toBalanceValue(ALT()||0,agent_i?.Denomination||12,12)}</Show> </span>
              </div>
              <div>
                <span class="inline-flex items-center gap-1 text-current/30" href="#" disabled={true}>{t("action.swap")}<Icon icon="ei:external-link"></Icon></span>
              </div>
            </div>
            <div class="flex items-center gap-2 justify-between">
              <div class="flex items-center gap-2">
                <Icon icon="ph:arrow-elbow-down-right-light"></Icon>
                <span class="tooltip" data-tip = "ALTb - ALT minting buff">
                  <span class="size-6 rounded-full bg-accent/50 inline-flex items-center justify-center" >💧</span>

                </span>
               
                <span class="text-sm"><Show when={!player.loading} fallback="...">{toBalanceValue(player()?.faucet?.[0]||0,agent_i?.Denomination||12,6)}</Show></span>
              </div>
              <div>
                {player()?.faucet?.[1]>0?<span class="text-current/50 inline-flex items-center text-sm gap-1">{t("m.getted")} {toBalanceValue(player()?.faucet?.[1]||0,agent_i?.Denomination||12,2)} <Icon icon="iconoir:check" /></span>:<a class="inline-flex items-center" target="_blank" href={locale()=="zh"?"https://docs.aolotto.com/cn/shui-long-tou":"https://docs.aolotto.com/en/faucet"}>{t("m.get")}<Icon icon="ei:external-link"></Icon></a>}
                
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
        rewards={player()?.win?.[0]}
        tax={player()?.tax?.[0]}
        user={address()}
        onClaimed ={(e)=>{
          batch(()=>{
            refetchALT()
            refetchUSDC()
            refetchPlayer()
          })
        }}
      />
    </main>
  </Show>
  )
}