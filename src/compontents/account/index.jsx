import { onMount,createSignal,createEffect,splitProps, onCleanup, Switch, Match } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import Avatar from "../avatar"
import { Copyable } from "../copyable"
import { shortStr } from "../../lib/tools"
import { useWallet } from "arwallet-solid-kit"
import Tabs from "../tabs"
import Balances from "./balances"
import Overview from "./overview"



export default props => {
  let _account_box_lisner
  const {address,connected,disconnect} = useWallet()
  
  const menus = [{
    key : "overview",
    label : "Overview",
  },{
    key : "bets",
    label : "Bets",
  },{
    key : "wins",
    label : "Wins",
  },{
    key : "mines",
    label : "Mines",
  },{
    key : "divs",
    label : "Divs",
  },{
    key : "claims",
    label : "Claims"
  }]
  const [visible,setVisible] = createSignal(false)
  const [stickied,setStickied] = createSignal(false)
  const [tab,setTab] = createSignal()
  const handleDisconnect = () => {
    console.log("Disconnect")
    disconnect()
    setVisible(false)
  }
  onMount(()=>{
    props?.ref({
      open:(e)=>{
        console.log("打开")
        setVisible(true)
      },
      close:(e)=>{
        setVisible(false)
      }
    })
    setTab(menus[0])
    _account_box_lisner = document.getElementById("account").addEventListener("scroll", (event) => {
      setStickied(document.getElementById("account").scrollTop > 60)
    });
  })
  onCleanup(()=>{
    removeEventListener("scroll",_account_box_lisner)
  })
  createEffect(()=>{
    if(visible()){
      document.body.style.overflow = 'hidden';
    }else{
      document.body.style.overflow = 'auto';
    }
  })
  return(
    
    <div 
      className="static top-0 left-0 h-0 w-0 z-[800] overflow-visible"
      style={{ visibility: `${visible() ? "visible" : "hidden"}` }}
    >
      <div
        className=" fixed right-0 top-0  z-[802] h-full w-full max-w-[480px] transition-all duration-500 md:p-2 "
        classList={{
          "translate-y-0 md:translate-x-0 md:translate-y-0  opacity-100" : visible(),
          "translate-y-100 md:translate-x-100 md:translate-y-0 opacity-0" : !visible()
        }}
      >
        <div className="w-full h-full bg-base-100 shadow-lg md:rounded-2xl md:border md:border-base-content/20 overflow-y-scroll" id="account">
          {/* header */}
          <div className="w-full flex justify-between items-center p-2 sticky top-0 bg-base-100/60 backdrop-blur-2xl border-b border-base-100 z-[803]">
            <div className="flex gap-2 items-center p-2">
              <Avatar username={address()} className="size-7"/>
              <Copyable value={address()}><span className="text-current/50">{shortStr(address()||"...",6)}</span></Copyable>
              {/* <span 
                className="text-current/50 transition-all duration-500 "
                classList={{
                  "opacity-0" : !stickied(),
                  "opacity-100" : stickied()
                }}
              >
                {shortStr(address()||"",6)}
              </span> */}
            </div>
            <div className=" flex gap-2 items-center justify-end">
            <div>
              <button tabindex="0" class="btn btn-circle btn-ghost btn-sm" popovertarget="popover-1" style={{"anchor-name":"--anchor-1"}}>
                <Icon icon="solar:logout-outline" />
              </button>
              <div className="dropdown dropdown-end  w-36 flex flex-col gap-2 rounded-box bg-base-100 shadow-sm p-4"
                popover="auto" id="popover-1" style={{"position-anchor":"--anchor-1"}}>
                  <button className="btn btn-primary" popovertarget="popover-1" popovertargetaction="hide" onClick={handleDisconnect}>Disconnect</button>
                  <button className="btn" popovertarget="popover-1" popovertargetaction="hide">Cancel</button>
              </div>
            </div>
            
              <button className="btn btn-circle btn-ghost btn-sm" onClick={()=>setVisible(false)}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className=" scale-200" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"></path></svg></button>
            </div>
          </div>
          
          {/* <div className="px-4 pb-4 flex items-center justify-center">
            <Copyable value={address()}><span className="text-current/50">{shortStr(address()||"...",6)}</span></Copyable>
          </div> */}
          {/* top */}
          <div className="px-4 py-2">
            
            <div className="flex flex-col py-2">
              <div className=" rounded-xl  px-2 py-2 flex justify-between items-center">
                <div className="flex flex-col flex-1"><span className=" uppercase text-current/50 text-xs">Unclaim Prize:</span><span className="text-sm">$200.00</span></div>
                <div><button className="btn btn-sm btn-primary">Claim</button></div>
              </div>
              <div className=" rounded-xl px-2 py-2 flex justify-between items-center">
                <div className=" flex flex-col flex-1"><span className=" uppercase text-current/50 text-xs">Unclaim Dividends:</span><span className="text-sm">$200.00</span></div>
                <div><button className="btn btn-sm btn-primary">Claim</button></div>
              </div>
            </div>

            <div className=" border-t border-base-300">
            <Balances/>
            </div>
            
            

            
            
          </div>
          {/* menu */}
          <div className="px-4">
          <Tabs 
            items={menus}
            current = {menus[0]}
            size = "lg"
            onSelected={({item,index})=>{
              setTab(item)
            }}
          />

          </div>
          
          {/* content */}
          <Switch>
            <Match when={tab()?.key=="overview"}><Overview/></Match>
            <Match when={tab()?.key=="bets"}><div>bets</div></Match>
            <Match when={tab()?.key=="wins"}><div>wins</div></Match>
            <Match when={tab()?.key=="mines"}><div>mines</div></Match>
            <Match when={tab()?.key=="divs"}><div>dividends</div></Match>
            <Match when={tab()?.key=="claims"}><div>cliams</div></Match>
          </Switch>

        </div>
      </div>
      <div 
        role="button" 
        className=" fixed w-full h-full bg-base-content/10 right-0 top-0 z-[801]  transition-all duration-500 backdrop-blur-xs flex justify-end items-center md:p-2 cursor-pointer hover:bg-base-content/5 hover:backdrop-blur-none"
        onClick={()=>setVisible(false)}
        classList={{
          "opacity-0" : ! visible(),
          "opacity-100" : visible()
        }}
        
      >
        {/* <button className="h-full w-full max-w-[420px] hover:bg-base-100/50 cursor-pointer rounded-2xl transition-all duration-500 flex items-start justify-start group" onClick={()=>setVisible(false)}>
          <div className="text-base-content px-1 py-4 group-hover:translate-x-2 transition-all duration-500"><Icon icon="iconoir:fast-arrow-right" /></div>
        </button> */}
      </div>
    </div>
  
  )
}