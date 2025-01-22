import { InfoItem } from "./infoitem"
import { address,connected,walletConnectionCheck } from "./wallet"
import { shortStr, toBalanceValue } from "../lib/tool"
import { For,Match,Show,Switch,createSignal } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { balances, refetchUserBalances } from "../signals/player"
import { protocols } from "../signals/global"
import Spinner from "./spinner"
import { setDictionarys,t } from "../i18n"

export default props => {
  let _recharger
  setDictionarys("en",{
    "recharger.button":"Deposit",
    "recharger.title":"Deposit wUSDC to your wallet",
    "recharger.balance":"wUSDC balance",
    "recharger.cancel":"Cancel",
    "recharger.deposit":"Deposit wUSDC on AOX",
    "recharger.desc":"Powered by AOX, all wUSDC you deposit stays in your wallet, ensure the depositing wallet matches the betting one.",
    "recharger.legend1":"Transfer from CEX (eg. Binance)",
    "recharger.legend2":"Bridge from your Ethereum wallet"
  })
  setDictionarys("zh",{
    "recharger.button":"充值",
    "recharger.title":"充值wUSDC到您的钱包",
    "recharger.balance":"wUSDC余额",
    "recharger.cancel":"取消",
    "recharger.deposit":"前往AOX上充值wUSDC",
    "recharger.desc":"由Aox提供支持，您充值的所有wUSDC代币将保留在您自己的钱包中,请确保充值的钱包与下注的钱包一致。",
    "recharger.legend1":"从交易所账户转账（例如Binance）",
    "recharger.legend2":"从以太坊钱包跨链"
  })
  const options = [ {
    legend : ()=>t("recharger.legend1"),
    key : "cex",
    items : [ {
      label : "Base",
      value : "cex_base",
      url : "https://aox.xyz/#/cex-deposit/base/USDC",
      logo : "https://aox.xyz/assets/base-bb4c2683.svg",
      fee : "$0",
    },{
      label : "BSC",
      value : "cex_bsc",
      url : "https://aox.xyz/#/cex-deposit/bsc/USDC",
      logo : "https://aox.xyz/assets/bsc-d4950bc2.svg",
      fee : "$0",
    } ],
  }, {
    legend : ()=>t("recharger.legend2"),
    key : "wallet",
    items : [ {
      label : "Ethereum",
      value : "wallet_eth",
      url : "https://aox.xyz/#/wallet-deposit/USDC/2",
      logo : "https://aox.xyz/assets/ethereum-cb5d3103.svg",
      fee : "$2-3.5",
    } ],
  } ]

  const [url,setUrl] = createSignal(options[0]?.items[0]?.url)
  return (
    <div className="">
    <button 
      popovertarget="recharger" 
      popoverTargetAction="show" 
      className="text-primary cursor-pointer flex items-center"
      use:walletConnectionCheck = {()=>{
        _recharger.showPopover()
      }}
    >
        {t("recharger.button")} <Icon icon="iconoir:arrow-up-right" />
      </button>
    <div id="recharger" popover className=" backdrop:bg-base-100/80 backdrop:backdrop-blur-lg" ref={_recharger}>
      
      
        <div className="w-full h-full fixed top-0 left-0 flex flex-col items-center justify-center">
          <div className="fixed z-2 top-0 right-0 p-4 w-full flex justify-between items-center" >
            <div className="flex-1">{t("recharger.title")}</div>
            <button className="btn btn-circle btn-ghost" popovertarget="recharger" popoverTargetAction="hide">
            <Icon icon="weui:close-outlined" />
            </button>
          </div>
         
        <div className="w-full max-w-[420px]">
           
            <div className="flex flex-col p-8 rounded-lg">
              {/* address */}
              <div className="text-lg py-4 px-2 ">{()=>shortStr(address() || "",6)}</div>
               {/* banlance */}
              <div className="py-4 px-4 bg-current/2 rounded-lg flex items-center justify-between border border-base-content/2">
                <div className="">
                <div className="text-sm text-current/50">{t("recharger.balance")}</div>
                <div className="text-2xl">
                  <Show when={balances.state == "ready"} fallback="...">{()=>toBalanceValue(balances()?.[protocols?.pay_id],6,2)}</Show>
                </div>
                </div>
                
                <Show when={balances.state == "ready"} fallback={<div><Spinner/></div>}>
                <button className="btn btn-ghost btn-circle" onClick={()=>refetchUserBalances()}>
                  <Icon icon="iconoir:refresh" />
                </button>
                </Show>
                
              </div>
              {/* radios */}
              <div className="py-4 ">
              <form onFormFata={(e)=>console.log(e)}>
                <For each={options}>
                  {(group)=>{
                    return (
                      <fieldset id={group.key} onChange={(e)=>{
                        setUrl(e.target?.value)
                      }}>
                        <legend className="text-current/50 text-sm p-2">{group.legend}</legend>
                        <div className="flex flex-col gap-2">
                        <For each={group.items}>
                          {(item)=>{
                            return (
                              <label className="flex w-full items-center justify-between bg-base-content/2 hover:bg-base-content/5 rounded-lg py-3 px-4 cursor-pointer border border-base-content/2 has-[:checked]:border-base-content/10">
                                <div className="inline-flex items-center gap-4">
                                  <image src={item.logo} className="size-6" />
                                  <span>{item.label}</span>
                                </div>
                                <div className="inline-flex items-center gap-4">
                                  <span className="text-current/50 text-xs">Fee:{item?.fee}</span>
                                  <input type="radio" className="radio" value={item?.url} name={item.value} checked={item?.url == url()}/>
                                </div>
                                
                              </label>
                            )
                          }}
                        </For>

                        </div>
                        
                      </fieldset>
                    )
                  }}
                </For>
              </form>
              </div>
              {/* desc */}
              <div className="text-xs py-4 px-2 text-current/50 bg-base-100">{t("recharger.desc")}</div>
              
              
              <button 
                  className="btn btn-primary btn-lg w-full"
                  onClick={()=>{
                    window.open(url(),"_blank")
                    _recharger.hidePopover()
                  }}
                >
                  {t("recharger.deposit")} <Icon icon="ei:external-link"/>
                </button>
            </div>
          </div>
        
        </div>
        
        
      

    </div>
  </div>
  )
}