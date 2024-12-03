import { Copyable } from "../../components/copyable"
import Avatar from "../../components/avatar"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Icon } from "@iconify-icon/solid"
import { Tabs } from "../../components/tabs"
import { batch, createEffect, createMemo, createSignal, Match, Show, Suspense, Switch } from "solid-js"
import { InfoItem } from "../../components/infoitem"
import tooltip from "../../components/tooltip"
import { connected,handleConnection,handleDisconnection,address } from "../../components/arwallet"
import { pool,currency,agent } from "../../signals/global"
import { createPlayerAccount,balances,refetchUserBalances } from "../../signals/player"
import Ticker from "../../components/ticker"
import Tickets from "./tickets"
import Rewards from "./rewards"
import Claims from "./claims"
import Dividends from "./dividends"
import Spinner from "../../components/spinner"
import { Claimer } from "../../components/claimer"
import toast from "solid-toast"



export default props=>{
  let _claimer
  const [account,{refetch:refetchAccount}] = createPlayerAccount(()=>({player:address(),pool:pool.id}))

  const subMenus = createMemo(()=>[{
    label:"Tickets",
    key:"tickets"
  },{
    label:"Rewards",
    key:"rewards"
  },{
    label:"Dividends",
    key:"dividends"
  },{
    label:"Claims",
    key: "claims"
  }])

  const [tab,setTab] = createSignal(subMenus()?.[0])

  

  return(
  <Show when={connected()} fallback={<main class="container">welcome</main>}>
    <main class="container">
      <section class="response_cols pt-12">
        <div class="col-span-full flex justify-between">
          <div class="inline-flex items-center gap-4">
            <Avatar username={address()} class="size-8"></Avatar>
            <span>
              <Copyable value={address()}>{shortStr(address(),6)}</Copyable>
            </span>
          </div>
          <div class="flex gap-4 items-center">
            {/* <span class="text-current/50 text-sm">Join at : 2024/11/13</span> */}
            <button 
              class="btn btn-icon rounded-full btn-ghost" 
              use:tooltip="top" 
              title="Disconnect"
              onClick={handleDisconnection}
            >
              <Icon icon="solar:logout-outline"></Icon>
            </button>
          </div>
        </div>
      </section>
      
      <section class="response_cols py-8 px-1">
        <div class="col-span-full lg:col-span-7">

          <InfoItem label={"Tickets"}><Show when={!account.loading} fallback="...">{account()?.bet?.[2]||0}</Show></InfoItem>
          <InfoItem label={"Total Bet"}><Show when={!account.loading} fallback="...">{toBalanceValue(account()?.bet?.[1]||0,currency.denomination||6,2)}</Show> <Ticker class="text-current/50">{currency.ticker}</Ticker></InfoItem>
          <InfoItem label={"Total Win"}><Show when={!account.loading} fallback="...">{toBalanceValue(account()?.win?.[1]||0,currency.denomination||6,2)}</Show> <Ticker class="text-current/50">{currency.ticker}</Ticker></InfoItem>
          <InfoItem label={"Total Mine"}><Show when={!account.loading} fallback="...">{toBalanceValue(account()?.mine||0,agent.denomination||12,4)}</Show> <Ticker class="text-current/50">{agent.ticker}</Ticker></InfoItem>
          <InfoItem label={"Dividends"}><Show when={!account.loading} fallback="...">{toBalanceValue(account()?.div||0,currency.denomination||6,2)}</Show> <Ticker class="text-current/50">{currency.ticker}</Ticker></InfoItem>
          
        </div>

        <div class="col-span-full lg:col-span-4 lg:col-end-13">
          <div class="flex justify-between pb-4">
            <div class="flex flex-col">
              <span class="text-current/50 uppercase">Unclaimed</span>
              <span><Show when={!account.loading} fallback="...">{toBalanceValue(account()?.win?.[0]||0,currency.denomination||6,2)}</Show> <Ticker class="text-current/50">{currency.ticker}</Ticker></span>
            </div>
            <div>
              <button 
                class="btn btn-primary rounded-full" 
                disabled={account()&&Number(account()?.win?.[0])<=0}
                onClick={()=>_claimer.open()}
              >
                Claim
              </button>
            </div>
          </div>
          <div class="py-6 flex flex-col gap-4 border-t border-current/10">
            <div class="flex items-center gap-2 justify-between">
              <div class="flex items-center gap-2">
                <Icon icon="ph:arrow-elbow-down-right-light"></Icon>
                <img src={`https://arweave.net/${currency.logo}`} class="size-6 rounded-full"/> 
                <span><Show when={!balances.loading} fallback="...">{toBalanceValue(balances()?.[currency.id]||0,currency.denomination||6,2)}</Show> <Ticker class="text-current/50">{currency.ticker}</Ticker></span>
              </div>
              <div>
                <a class="inline-flex items-center" href="#">Depoist<Icon icon="ei:external-link"></Icon></a>
              </div>
            </div>
            <div class="flex items-center gap-2 justify-between">
              <div class="flex items-center gap-2">
                <Icon icon="ph:arrow-elbow-down-right-light"></Icon>
                <img src={`https://arweave.net/3u9Hr7xL02QjVikyY7i3o7ZiRMdoJqr3eQDzT6SOz1s`} class="size-6 rounded-full"/> 
                <span><Show when={!balances.loading} fallback="...">{toBalanceValue(balances()?.[agent.id]||0,agent.denomination||12,2)}</Show>  <Ticker class="text-current/50">{agent.ticker}</Ticker></span>
              </div>
              <div>
                <a class="inline-flex items-center" href="#">Buy/Sell<Icon icon="ei:external-link"></Icon></a>
              </div>
            </div>
          </div>
        </div>

      </section>

      <Tabs
        class="mt-0"
        items={subMenus()}
        current={tab()||subMenus()?.[0]}
        onSelected={({index,item})=>setTab(item)}
      />
      <Suspense fallback={<Spinner/>}>
        <Switch>
          <Match when={tab()?.key=="tickets"}><Tickets/></Match>
          <Match when={tab()?.key=="dividends"}><Dividends/></Match>
          <Match when={tab()?.key=="rewards"}><Rewards/></Match>
          <Match when={tab()?.key=="claims"}><Claims/></Match>
        </Switch>
      </Suspense>
      <Claimer 
        ref={_claimer}
        rewards={account()?.win?.[1]}
        tax={account()?.tax?.[0]}
        user={address()}
        onClaimed ={(e)=>{
          
          toast.success("Claimed!")
          batch(()=>{
            refetchUserBalances()
            refetchAccount()
          })
          // toast.promise(new Promise((resolve, reject) => {
            
          // }),{
          //   loading: 'Querying Claiming Result...',
          //   success: (val) => {
          //     const mined = val.x_mined&&val.x_mined.split(",")
          //     return (
          //       <div>
          //         Successfully bet <span class="inline-flex bg-current/10 rounded-full px-2 py-1">{val.x_numbers}*{val.count}</span> to round {val.round} <Show when={val.x_mined}> and get mining reward: {toBalanceValue(mined[0],mined[2],2)} ${mined[1]}</Show>! 
          //         <a href={`${app.ao_link_url}/#/entity/${val?.id}?tab=linked`} target="_blank">
          //           <Icon icon="ei:external-link"></Icon>
          //         </a>
          //       </div>
          //     )
          //   },
          //   error: "Querying faild."
          // })
        }}
      />
    </main>
  </Show>
  )
}