import Logo from "./logo";
import { Icon } from "@iconify-icon/solid"
import { t,setDictionarys,locale,setLocale,locales } from "../i18n"
import { Index,createMemo } from "solid-js";
import { A } from "@solidjs/router";
import label from "daisyui/components/label";
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
    "nav.divs":"分红",
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
    name: "faucet",
    path: locale()=="en"?"https://docs.aolotto.com/en/faucet":"https://docs.aolotto.com/cn/shui-long-tou",
    new: true
  },{
    name: "docs",
    path: locale()=="en"?"https://docs.aolotto.com/en":"https://docs.aolotto.com/cn",
    new: true,
    out: true
  }])

  // const menus = [{
  //   group_name: "Onchain lottery",
  //   items : [{
  //     label: "github",
  //     url: ""}],
  // },{}]


  return (
    <header className="navbar bg-base-100 w-full h-16 sticky z-1 top-0 py-0 px-1 lg:px-4">
      <div className="flex-1">
        <A className="btn btn-ghost rounded-full" href="/"><Logo type="full" className=" scale-110"/></A>
        
      </div>
      
      <div className="flex-none navbar-end gap-1 lg:gap-2">
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
        <div>
          <button className="btn rounded-full min-w-[2em]">{t("h.connect")}</button>
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
    </header>
  );
}