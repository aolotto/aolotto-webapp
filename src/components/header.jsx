
import { A } from "@solidjs/router"
import { createMemo,createSignal,onMount,onCleanup } from "solid-js"
import { t,setDictionarys,locale } from "../i18n"
import { Icon } from "@iconify-icon/solid"
// components
import Logo from "./logo"
import Avatar from "./avatar"
import Langpicker from "./langpicker"
import tooltip from "./tooltip"
import { connected, address, handleConnection,connecting } from "./wallet"
import { shortStr } from "../lib/tool"
import { app } from "../signals/global"
import Spinner from "./spinner"


export default props => {

  let _header

  setDictionarys("en",{
    "nav.bets": "Bets",
    "nav.draws":"Draws",
    "nav.rank":"Rank",
    "nav.alt": "$ALT",
    "nav.docs":"Docs",
    "nav.faucet":"🚰",
    "h.connect":"Connect",
    "h.conecting":"Connecting"
  })

  setDictionarys("zh",{
    "nav.bets": "投注",
    "nav.draws":"開獎",
    "nav.rank":"排行",
    "nav.alt": "$ALT",
    "nav.docs":"文檔",
    "nav.faucet":"🚰",
    "h.connect":"連接钱包",
    "h.conecting":"連接中"
  })

  const [stickied,setStickied] = createSignal(false)

  const navs = createMemo(()=>[{
    name: "bets",
    path: "/bets",
  },{
    name: "draws",
    path: "/draws"
  },{
    name: "rank",
    path: "/rank"
  },{
    name: "alt",
    path: "/alt"
  },{
    name: "faucet",
    path: locale()=="en"?"https://docs.aolotto.com/en/faucet":"https://docs.aolotto.com/cn/shui-long-tou",
    new: true
  },{
    name: "docs",
    path: locale()=="en"?"https://docs.aolotto.com/en":"https://docs.aolotto.com/cn",
    new: true,
    out: true
  }])

  onMount(()=>{
    window.onscroll = function (e) {
      setStickied(window.scrollY > _header.getBoundingClientRect().height)
    };
  })

  onCleanup(()=>{
    window.onscroll = null
  })


  return(
    <header
      ref={_header}
      className="h-16 flex items-center gap-4 px-4 justify-between sticky top-0 w-full z-1"
      classList={{
        "bg-base-0/100 shadow-gray-1000/5 shadow-xs":stickied(),
      }}
    >
      {/* left */}
      <div class="flex justify-start items-center gap-2">
        <A 
          href="/" 
          class="text-current"
        >
          <Logo/> 
        </A>
        <Show when={app?.mode == "development"}>
        <span class="inline-flex bg-base-200 text-xs px-1 rounded-sm uppercase text-current/50">dev</span>
        </Show>
        
      </div>

      {/* right */}
      <div class="flex justify-end items-center">
      <nav class="gap-6 mr-4 hidden md:flex">
        <Index each={navs()} fallback={<div>Loading...</div>}>
          {(item) => (
            <A 
              href={item()?.path} 
              activeClass="active"
              inactiveClass=""
              class="inline-flex items-center gap-1 text-lg"
              target={`${item().new?"_blank":"_self"}`}>
                {t(`nav.${item()?.name}`)} {item().out&&<Icon icon="ei:external-link"></Icon>}
            </A>
          )
          }
        </Index>
        </nav>
        <div class="flex items-center gap-4">
          <Show 
            when={connected()} 
            fallback={
              <button 
                class="btn rounded-full"
                onClick={handleConnection}
                disabled={connected()||connecting()}
              >
                {connecting()?<Spinner/>:t("h.connect")}
              </button>
            }
          >
            <a 
              href="/me" 
              use:tooltip={["bottom-left-overlap",()=>address()]}
              class="btn rounded-full p-1 h-fit"
            >
              <Avatar username={address()} class="size-6"></Avatar>
            </a>
          </Show>
          <Langpicker/>
        </div>
      </div>
    </header>
  )
}