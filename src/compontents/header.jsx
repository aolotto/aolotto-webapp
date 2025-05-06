import Logo from "./logo";
import { Icon } from "@iconify-icon/solid"
import { t,setDictionarys,locale,setLocale,locales } from "../i18n"
import { Index,createMemo,createSignal,onMount,onCleanup } from "solid-js";
import { A } from "@solidjs/router";
import { useWallet } from "arwallet-solid-kit";
import Avatar from "./avatar";
import Spinner from "./spinner"
import { useApp,useUser } from "../contexts";
import { Portal } from "solid-js/web";
export default props => {
  let _header
  
  setDictionarys("en",{
    "nav.bets": "Bets",
    "nav.draws":"Draws",
    "nav.rank":"Ranks",
    "nav.divs":"Divs",
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
    "nav.divs":"分紅",
    "nav.alt": "$ALT",
    "nav.docs":"文檔",
    "nav.faucet":"🚰",
    "h.connect":"連接",
    "h.conecting":"連接中"
  })
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
    name: "divs",
    path: "/divs"
  },{
    name: "alt",
    path: "/alt"
  },{
    name: "docs",
    path: locale()=="en"?"https://docs.aolotto.com/en":"https://docs.aolotto.com/cn",
    new: true,
    out: true
  }])
  const [stickied,setStickied] = createSignal(false)
  const { openAccount } = useUser()
  const { connected, address, connecting, showConnector } = useWallet()

  onMount(()=>{
    window.onscroll = function (e) {
      setStickied(window.scrollY > _header.getBoundingClientRect().height)
    };
  })

  onCleanup(()=>{
    window.onscroll = null
  })


  return (
    <header
      ref={_header}
      className="navbar w-full h-16 sticky z-1 top-0 py-0 px-1 lg:px-4 gap-4 "
      classList = {{
        "bg-base-100 backdrop-blur-2xl shadow-gray-1000/5  shadow-xs" : stickied()
      }}
    >
      
      <div className=" flex-none">
        <A className="btn btn-ghost rounded-full" href="/"><Logo type="full" className=" scale-110"/></A>
        
      </div>
      
      <div className=" flex-1 gap-1 lg:gap-2 items-center flex justify-end">
        <div class="dropdown dropdown-bottom dropdown-center lg:hidden">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
          </div>
          <ul
            tabindex="0"
            class="menu dropdown-content panel rounded-box z-2 m-3 w-52 p-2 ">
            <Index each={navs()} fallback={<div>Loading...</div>}>
              {(item) => (
                <li>
                  <A 
                    href={item()?.path} 
                    activeClass="text-base-content bold"
                    inactiveClass="text-primary link link-hover"
                    class="inline-flex items-center gap-1 text-lg w-full justify-between"
                    target={`${item().new?"_blank":"_self"}`}>
                      {t(`nav.${item()?.name}`)} {item().out&&<Icon icon="ei:external-link"></Icon>}
                  </A>
                </li>
              )
              }
            </Index>
          </ul>
        </div>
        <ul className="hidden lg:flex items-center menu menu-horizontal">
          <Index each={navs()} fallback={<div>Loading...</div>}>
            {(item) => (
              <li>
                <A 
                  href={item()?.path} 
                  activeClass="text-base-content bold"
                  inactiveClass="text-primary link link-hover"
                  class="inline-flex items-center gap-1 text-lg rounded-full"
                  target={`${item().new?"_blank":"_self"}`}>
                    {t(`nav.${item()?.name}`)} {item().out&&<Icon icon="ei:external-link"></Icon>}
                </A>
              </li>
            )
            }
          </Index>        
        </ul>
      </div>
      <div className=" flex-none flex items-center">
        <div>
          <Show when={address()} fallback={
            <button 
              disabled={connecting()||connected()}
              className="btn rounded-full min-w-[2em]"
              onClick={showConnector}
            >
              {connecting()?<Spinner size="sm"/>:t("h.connect")}
            </button>
          }>
            <div class="tooltip tooltip-left">
              <div class="tooltip-content text-left w-[20em] break-words">{address()}</div>
              <btn 
                onClick = {openAccount}
                class="btn btn-circle btn-ghost"
              >
                <Avatar username={address()} class="size-6"></Avatar>
              </btn>
            </div>
            {/* <div class=" ">
              
              <div class="drawer-content">
                <label for="drawer-account" class="drawer-button btn btn-circle btn-ghost">
                <Avatar username={address()} class="size-6"></Avatar>
                </label>
              </div>
              
            </div> */}
          </Show>
          
        </div>
        <div className="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost rounded-full">
            <Icon icon="iconoir:language"></Icon>
            <Icon icon="iconoir:nav-arrow-down" />
          </div>
          
          <ul
            tabindex="0"
            class="menu dropdown-content panel rounded-box z-2 m-3 w-36 p-2 ">
              <For each={Object.keys(locales)}>
                {(item) => (
                  <li>
                    <a role="button" onClick={()=>setLocale(item)} class="btn btn-ghost w-full justify-start">
                      <span class="inline-flex bg-base-content/80 text-base-100 uppercase rounded-md text-xs px-1">{item}</span>
                      <span>{locales[item].name}</span>
                    </a>
                  </li>
                )
                }
              </For>
          </ul>
        </div>
      </div>
      <Show when={stickied()}>
        <Portal>
        <div className=" fixed bottom-2 right-2 md:hidden">
          <button className="btn btn-circle" onClick={()=>{
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: "smooth",
            });
          }}>
          <Icon icon="lsicon:top-outline" />
          </button>
        </div>
        </Portal>
      </Show>
    </header>
  );
}