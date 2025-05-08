import { createMemo, createSignal, For } from "solid-js"
import {t,setDictionarys} from "../i18n"
import { Portal } from "solid-js/web"
import Modal from "./modal"
import { Icon } from "@iconify-icon/solid"

export default props => {
  let _modal
  setDictionarys("en",{
    "usd.deposit" : "Deposit",
    "usd.t_web3" : "Transfer from Web3 wallet",
    "usd.t_exchange" : "Transfer from Exchange",
    "usd.t_dex" : "Buy on DEX",
    "usd.i_eth" : "Bridge via Ethereum",
    "usd.i_base" : "Deposit via Base",
    "usd.i_bsc" : "Deposit via BSC"
  })
  setDictionarys("zh",{
    "usd.deposit" : "儲值",
    "usd.t_web3" : "从web3钱包转账",
    "usd.t_exchange" : "从交易所转账",
    "usd.t_dex" : "从DEX上购买",
    "usd.i_eth" : "通过以太坊跨链",
    "usd.i_base" : "通过Base链充值",
    "usd.i_bsc" : "通过BSC链充值"
  })
  // const [open,setOpen] = createSignal(false)
  const links = createMemo(()=>[{
    title : ()=> t("usd.t_web3"),
    items : [{
      label : ()=>t("usd.i_eth"),
      link : "https://aox.xyz/#/beta"
    }]
  },{
    title : ()=> t("usd.t_exchange"),
    items : [{
      label : ()=>t("usd.i_base"),
      link : "https://aox.xyz/#/cex-deposit/base/USDC/1"
    },{
      label : ()=>t("usd.i_bsc"),
      link : "https://aox.xyz/#/cex-deposit/bsc/USDC/1"
    }]
  },{
    title : ()=> t("usd.t_dex"),
    items : [{
      label : "permaSwap",
      link : "https://www.permaswap.network/#/ao/xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10%267zH9dlMNoxprab9loshv3Y7WG45DOny_Vrq9KrXObdQ?tab=swap"
    }]
  }])
  return (
    <div className=" inline">
      <a 
        role="button"
        className="btn btn-link"
        onClick={()=>_modal.open()}
      >
        {t("usd.deposit")}
      </a>
      <Portal>
        <Modal id="depositUSD" title={t("usd.deposit")} ref={_modal} className="w-[320px]">
          <div className="px-4 pb-4 flex flex-col">
            <For each={links()}>
              {group=>
                <ul className="menu w-full">
                  <li className="menu-title">{group.title}</li>
                  <For each={group.items}>
                    {item=><li><a href={item.link} target="_blank" className=" inline-flex justify-between items-center"><span>{item.label}</span><Icon icon="ei:external-link"></Icon></a></li>}
                  </For>
                </ul>
              }
            </For>
            {/* <ul className="menu w-full  ">
              <li className="menu-title">Transfer from Web3 wallet</li>
              <li><a href="https://aox.xyz/#/cex-deposit/base/USDC/1" className=" inline-flex justify-between items-center"> <span>Bridge via Ethereum</span> <Icon icon="ei:external-link"></Icon></a></li>
              <li><a>Bridge via Base</a></li>
              <li><a>Bridge via BSC</a></li>
            </ul>
            <ul className="menu w-full  ">
              <li className="menu-title">Deposit from CEX</li>
              <li><a className="https://aox.xyz/#/cex-deposit/base/USDC/1">Bridge via Ethereum</a></li>
              <li><a>Bridge via Base</a></li>
              <li><a>Bridge via BSC</a></li>
            </ul>
            <ul className="menu w-full">
              <li className="menu-title">Buy on DEX</li>
              <li><a>permaswap</a></li>
            </ul> */}
          </div>
        </Modal>
      </Portal>
    </div>
    // <details className={mergeClasses(" static inline-block",props?.className || props?.class)} style={{"anchor-name":"--anchor-el"}} open={open()}>
    //   <summary className="btn btn-link">{t("usd.deposit")}</summary>
    //   <content className="  absolute bottom-[anchor(top)] right-[anchor(right)] panel rounded-box flex flex-col divide-y divide-base-300" style={{"position-anchor":"--anchor-el"}}>
    //     <ul className="menu w-52  ">
    //     <li><a role="button" onClick={()=>setOpen(false)}>Bridge via Ethereum</a></li>
    //     <li><a>Bridge via Base</a></li>
    //     <li><a>Bridge via BSC</a></li>
    //     </ul>
    //     <ul className="menu w-52 p-2">
    //     <li><a>Buy on DEX</a></li>
    //     </ul>
    //   </content>

    //   {/* <ul className="menu dropdown-content bg-base-100 rounded-box w-52 p-2 shadow-sm float-start">
    //     <li><a>Bridge from Ethereum</a></li>
    //     <li><a>Bridge from Base</a></li>
    //     <li><a>Bridge from BSC</a></li>
    //   </ul> */}
    // </details>
  )
}