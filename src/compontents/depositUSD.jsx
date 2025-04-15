import { createSignal } from "solid-js"
import {t,setDictionarys} from "../i18n"
import mergeClasses from "@robit-dev/tailwindcss-class-combiner"

export default props => {
  setDictionarys("en",{
    "usd.deposit" : "Deposit"
  })
  setDictionarys("zh",{
    "usd.deposit" : "儲值"
  })
  const [open,setOpen] = createSignal(false)
  return (
    <details className={mergeClasses(" static inline-block",props?.className || props?.class)} style={{"anchor-name":"--anchor-el"}} open={open()}>
      <summary className="btn btn-link">{t("usd.deposit")}</summary>
      <content className="  absolute bottom-[anchor(top)] right-[anchor(right)] panel rounded-box flex flex-col divide-y divide-base-300" style={{"position-anchor":"--anchor-el"}}>
        <ul className="menu w-52  ">
        <li><a role="button" onClick={()=>setOpen(false)}>Bridge via Ethereum</a></li>
        <li><a>Bridge via Base</a></li>
        <li><a>Bridge via BSC</a></li>
        </ul>
        <ul className="menu w-52 p-2">
        <li><a>Buy on DEX</a></li>
        </ul>
      </content>

      {/* <ul className="menu dropdown-content bg-base-100 rounded-box w-52 p-2 shadow-sm float-start">
        <li><a>Bridge from Ethereum</a></li>
        <li><a>Bridge from Base</a></li>
        <li><a>Bridge from BSC</a></li>
      </ul> */}
    </details>
  )
}