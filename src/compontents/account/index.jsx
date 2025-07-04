import { createEffect, createSignal,onMount, Suspense,batch, createMemo,Match, Switch, For, createResource, Show } from "solid-js"
import { Portal } from "solid-js/web"
import Balances from "./balances"
import { useWallet } from "arwallet-solid-kit"
import { useApp,useUser } from "../../contexts"
import { shortStr, toBalanceValue } from "../../lib/tools"
import Avatar from "../avatar"
import { Copyable } from "../copyable"
import { Icon } from "@iconify-icon/solid"
import { t,setDictionarys } from "../../i18n"
import { fetchClaimApproveResult } from "../../api"


import Spinner from "../spinner"
import Tabs from "../tabs"
import Withdraw from "./withdraw"

import Tickets from "./tickets"
import Mintings from "./mintings"
import Stakings from "./stakings"
import Wins from "./wins"
import Claims from "./cliams"
import Overview from "./overview"
import Claimer from "./claimer"

export default function Account(props) {
  let _account_inner
  let _dividend_claimer
  let _prize_claimer
  const {notify,info} = useApp()
  const { address,disconnect } = useWallet()
  const { player,refetchPlayer,refetchUsdcBalance } = useUser()
  const [ visible, setVisible ] = createSignal(false)
  const [ tab, setTab ] = createSignal()
  const [ offset, setOffset ] = createSignal(0)
  const [ prizeApproves,setPrizeApproves ] = createSignal()
  
   setDictionarys("en",{
      "act.overview" : "Overview",
      "act.bets" : "Bets",
      "act.wins" : "Wins",
      "act.mintings" : "Mints",
      "act.divs" : "Divs",
      "act.stakings" : "Stakes",
      "act.claims" : "Cliams",
      "act.unclaim_prize" : "Unclaim Prize",
      "act.unclaim_dividends" : "Unclaim Dividends",
      "disconnect" : "Disconnect",
      "cancel" : "Cancel"
    })
    setDictionarys("zh",{
      "act.overview" : "概述",
      "act.bets" : "投注",
      "act.wins" : "獲勝",
      "act.mintings" : "鑄造",
      "act.divs" : "分紅",
      "act.stakings" : "質押",
      "act.claims" : "領取",
      "disconnect" : "斷開連結",
      "act.unclaim_prize" : "待领取奖金",
      "act.unclaim_dividends" : "待领取分红",
      "cancel" : "取消"
    })
  onMount(()=>{
    props?.ref({
      open:(e)=>{
        setTab(tab() || menus[0])
        setVisible(true)
        _account_inner.scrollTo({top:0,behavior:"smooth"})
        if(document.getElementById("account-tabs")){
          setOffset(document.getElementById("account-tabs")?.offsetTop - 40)
        }

      },
      close:(e)=>{
        setVisible(false)
      }
    })
    if(address()&&info?.agent_process){
      // Load prize approves from localStorage
      const key = `approve_prize_${info.agent_process}_${address()}`
      const localPrizeApproves = localStorage.getItem(key)
      if(localPrizeApproves){
        setPrizeApproves(JSON.parse(localPrizeApproves))
      }
    }
  })

  const [approveStates] = createResource(() => ({
    msg_ids : prizeApproves()?.map((i)=>i.id),
    agent_id : info?.agent_process,
  }), fetchClaimApproveResult)

  createEffect(()=>{
    if(approveStates.state == "ready" && approveStates() ){
      console.log("Approve States:",approveStates())
    }
  })

  const menus = createMemo(()=>[{
    key : "overview",
    label : ()=> t("act.overview"),
  },{
    key : "bets",
    label : ()=> t("act.bets"),
  },{
    key : "wins",
    label : ()=> t("act.wins"),
  },{
    key : "mintings",
    label : ()=> t("act.mintings"),
  },{
    key : "stakings",
    label : ()=> t("act.stakings"),
  },{
    key : "claims",
    label : ()=> t("act.claims")
  }])
  createEffect(()=>{
    if(visible()){
      document.body.style.overflow = 'hidden';
    }else{
      document.body.style.overflow = 'auto';
    }
  })

    const handleDisconnect = () => {
      disconnect()
      setVisible(false)
    }
  const Heading = () => (
    <div className="w-full flex items-center justify-between ">
      <div className="flex gap-2 items-center py-2 px-4">
        <Avatar username={address()} className="size-7" />
        <Copyable value={address()}><span className="text-current/50">{shortStr(address() || "...", 6)}</span></Copyable>
      </div>
      <div className=" flex gap-2 items-center justify-end">
        <div>
          <button tabindex="0" class="btn btn-circle btn-ghost btn-sm" popovertarget="popover-1" style={{ "anchor-name": "--anchor-1" }}>
            <Icon icon="solar:logout-outline" />
          </button>
          <div className="dropdown dropdown-end  w-36 flex flex-col gap-2 rounded-box panel p-4"
            popover="auto" id="popover-1" style={{ "position-anchor": "--anchor-1" }}>
            <button className="btn btn-primary" popovertarget="popover-1" popovertargetaction="hide" onClick={handleDisconnect}>{t("disconnect")}</button>
            <button className="btn" popovertarget="popover-1" popovertargetaction="hide">{t("cancel")}</button>
          </div>
        </div>

        <button className="btn btn-circle btn-ghost btn-sm" onClick={() => setVisible(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className=" scale-200" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"></path></svg>
        </button>
      </div>
    </div>
    )
    const Approves = () =>(
      <div className="flex flex-col py-2">
        
        <div className=" rounded-lg bg-primary/20 p-2">
          <h3 className=" flex items-center justify-between text-sm">
            <span>{prizeApproves()?.length} pending claims</span>
            <svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle><path d="m12,17v-5.5c0-.276-.224-.5-.5-.5h-1.5" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path><circle cx="12" cy="7.25" r="1.25" fill="currentColor" stroke-width="2"></circle></g></svg>
          </h3>
          <ul className="mt-2 pt-2 border-t border-base-content/20 ">
          <For each={prizeApproves()}>
            {(approve) => (
              <li className="flex items-center justify-between gap-2 py-1 text-sm">
                <div className="flex items-center gap-2 ">
                  Cliamed ${toBalanceValue(approve?.amount,6)}
                </div>
                <div className="flex items-center gap-2">
                  
                  <Show when={approveStates?.state == "ready"} fallback ={<Spinner size="sm"/>}>
                    <span>{approveStates()?.[approve?.id]? <span>Approved <button className="btn btn-xs" onClick={()=>{
                      setPrizeApproves(prizeApproves()?.filter((i)=>i.id != approve.id))
                      localStorage.setItem(`approve_prize_${info.agent_process}_${address()}`,JSON.stringify(prizeApproves()?.filter((i)=>i.id != approve.id)))
                    }}>clean</button></span> : "Approving..."}</span>
                  </Show>
                  <a href={"https://www.ao.link/#/message/"+approve?.id} target="_blank"><Icon icon="ei:external-link"></Icon></a>
                </div>
              </li>
            )}
          </For>
            {/* <li>1</li>
            <li>2</li> */}
          </ul>
        </div>

      </div>
    )
    const UnClaims = () => (
      <div className="flex flex-col py-2">
        <div className=" rounded-xl  px-2 py-2 flex justify-between items-center">
          <div className="flex flex-col flex-1">
            <span className=" uppercase text-current/50 text-xs">{t("act.unclaim_prize")}</span>
            <span className="text-sm">
            <Show when={player.state == "ready"} fallback={<span className=" skeleton w-[4em] h-[1em] inline-block"></span>}>${toBalanceValue(player()?.win?.[0],6)}</Show>
            </span>
          </div>
          <div class="flex gap-2 items-center">
            <Show when={prizeApproves()&& prizeApproves()?.length > 0}>
              <button class="badge badge-info rounded-full badge-sm">
                <svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle><path d="m12,17v-5.5c0-.276-.224-.5-.5-.5h-1.5" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></path><circle cx="12" cy="7.25" r="1.25" fill="currentColor" stroke-width="2"></circle></g></svg>
                {prizeApproves()?.length}
              </button>
            </Show>
            <Show when={player.state=="ready"} fallback={<button className="btn btn-sm" disabled><Spinner/></button>}>
              <button 
                disabled={player()?.win?.[0] < 1 ||!player()} 
                className="btn btn-sm btn-primary"
                onClick={()=>_prize_claimer.open({amount : player()?.win?.[0] || 0})}
              >
                {t("act.claims")}
              </button>
            </Show>
          </div>
        </div>
        <div className=" rounded-xl px-2 py-2 flex justify-between items-center">
          <div className=" flex flex-col flex-1">
            <span className=" uppercase text-current/50 text-xs">{t("act.unclaim_dividends")}</span>
            <span className="text-sm"><Show when={player.state == "ready"} fallback={<span className=" skeleton w-[4em] h-[1em] inline-block"></span>}>${toBalanceValue(player()?.div?.[0],6)}</Show></span>
          </div>
          <div>
          <Show when={player.state=="ready"} fallback={<button className="btn btn-sm" disabled><Spinner/></button>}>
            <button 
              disabled={player()?.div?.[0] < 1 || !player()} 
              className="btn btn-sm btn-primary"
              onClick={()=>_dividend_claimer.open({
                amount : player()?.div?.[0] || 0
              })}
            >
              {t("act.claims")}
            </button>
          </Show>
          </div>
        </div>
      </div>
    )
  
  return (
    <div 
      className="fixed top-0 left-0 h-0 w-0 z-10 overflow-visible"
      style={{ visibility: `${visible() ? "visible" : "hidden"}` }}
    >
      <div 
        ref={_account_inner}
        className=" fixed top-0 right-0 bottom-0 z-20 bg-base-100 h-full w-full max-w-[420px] transition-all duration-300 overflow-y-scroll shadow-sm" 
        classList={{ "translate-x-0": visible(), "translate-x-full": !visible() }}
      >
        <div className=" sticky top-0 left-0 w-full h-12 z-20 bg-base-100 flex items-center">
          <Heading/>
        </div>
        <div className=" px-4">
          <Show when={prizeApproves() && prizeApproves()?.length > 0}>
            <Approves/>
          </Show>
         
          <UnClaims/>
          <div className="border-t border-base-300 pt-2">
            <Balances/>
          </div>
          
        </div>
        <Switch>
          
        <Match when={player.state=="ready" && player()!=null}>
        <div className="sticky top-12 left-0 w-full h-12 z-20 bg-base-100" id="account-tabs">
          <Tabs
            className="px-4"
            items={menus()}
            current={tab()}
            onSelected={({item,index})=>{
              _account_inner.scrollTo({top:offset(),behavior:"smooth"})
              setTab(item)
            }}
          />
        </div>
        <div className="min-h-full px-4 box-border overflow-x-hidden">
          <Suspense fallback={<Spinner className="w-full py-10 overflow-x-hidden"/>}>
            <Switch>
              <Match when={tab()?.key=="overview" || !tab()}><Overview/></Match>
              <Match when={tab()?.key=="bets"}><Tickets /></Match>
              <Match when={tab()?.key=="wins"}><Wins/></Match>
              <Match when={tab()?.key=="mintings"}><Mintings/></Match>
              <Match when={tab()?.key=="stakings"}><Stakings/></Match>
              <Match when={tab()?.key=="claims"}><Claims/></Match>
            </Switch>
          </Suspense>
        </div>
        </Match>
        <Match when={player.state=="ready" && player()==null}>
          <div className="w-full px-6 py-10  ">
            <div className="flex flex-col gap-2 justify-center items-center w-full p-6">
            <h3 className="text-lg text-center">🚰</h3>
            <p className=" text-sm text-center">Newly joined addresses can claim minting buff (ALTB) via the faucet.</p>
            <a href="https://docs.aolotto.com/en/faucet" target="_blank" className=" btn btn-primary">Learn more</a>

            </div>
            
          </div>
        </Match>
        </Switch>
        <Portal>
          <Withdraw ref={_dividend_claimer} onWithdrawn={(msg)=>{
              batch(()=>{
                refetchPlayer(),
                refetchUsdcBalance()
              })
              notify("Dividend has been claimed.","alert-info")
            }}/>
          </Portal>
        <Portal>
          <Claimer ref={_prize_claimer} onClaimed={(prizeApproves)=>{
             batch(()=>{
              setPrizeApproves(prizeApproves)
              refetchPlayer()
            })
            notify("Your claim request has been submitted. The reward will be reviewed and distributed within 24 hours.","alert-info")
          }}/>
        </Portal>
      </div>
      {/* mask */}
      <div 
        className="bg-base-300/80 w-full h-full fixed top-0 left-0 z-10 transition-all duration-300"
        classList={{ "opacity-100": visible(), "opacity-0": !visible() }}
        onClick={() => {
          setVisible(false)
        }}
      >
      </div>
    </div>
  )
}