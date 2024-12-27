import { createRoot,createSignal, createMemo, onMount,For, Switch, Match, createEffect, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { Othent } from "@othent/kms"
import Arweave from "arweave/web"
import { ArweaveWebWallet } from 'arweave-wallet-connector'
import { Icon } from "@iconify-icon/solid";
import { toast } from "solid-toast"
import { shortStr } from "../lib/tool";
import Spinner from "./spinner";
import { Modal, ModalContainer, ModalHeader } from "./popup";

const getWalletSdk = (key,enables) =>{
  const enable =  enables.find((item)=>item.key === key && item.enable)
  return enable.sdk
}

export const {
  connecting,
  connect,
  disconnect,
  connected,
  address,
  sdk,
  createTemporaryWallet,
  enables,
  walletConnectionCheck,
  initwallet,
  wallet,
  handleConnection,
  handleDisconnection,
  inited
} = createRoot(() => {
  let connector
  let disconnector
  const [inited,setInted] = createSignal(false)
  const [sdk,setSdk] = createSignal()
  const [connecting,setConnecting] = createSignal(false)
  const [address, setAddress] = createSignal(null);
  const [loadingWallet,setLoadingWallet] = createSignal(false)
  const [enables,setEnables] = createSignal(
    [{
      key : "arconnect",
      name: "Arconnect",
      desc: "Browser plug-in wallet",
      type: "web3",
      logo: "https://arweave.net/tQUcL4wlNj_NED2VjUGUhfCTJ6pDN9P0e3CbnHo3vUE",
      downlink : "https://www.arconnect.io/download",
      sdk: globalThis?.arweaveWallet || window?.arweaveWallet,
      enable: (globalThis?.arweaveWallet || window?.arweaveWallet)? true : false
    },{
      key: "othent",
      name: "Othent",
      desc: "Login via email",
      logo: "https://228480384-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/organizations%2FH1lMs0EXPi5W7DrBLxCk%2Fsites%2Fsite_EwgSU%2Ficon%2FNUQqw17QN3bI11zZ3Otq%2Ficon.svg?alt=media&token=366bb4df-990c-4641-84fa-e2575a74470b",
      enable: Othent ? true :false
    },{
      key : "arweaveapp",
      name : "ArweaveApp",
      desc : "Web based wallet",
      type: "web3",
      logo : "https://arweave.net/qVms-k8Ox-eKFJN5QFvrPQvT9ryqQXaFcYbr-fJbgLY",
      enable: ArweaveWebWallet? true: false
    }]
  )
  const [mode,setMode] = createSignal("list")
  const [currentConnectingInfo,setCurrentConnectingInfo] = createSignal()
  const [disconnecting,setDisconnecting] = createSignal(false)
  const [configs,setConfigs] = createSignal({
    appInfo:{
      name:"coolApp",
      logo:""
    },
    permissions:["ACCESS_ADDRESS","SIGN_TRANSACTION"],
    gateWay:{
      host: "arweave.net",
      port: 443,
      protocol: "https"
    }
  })
  
  const connected = createMemo(()=>{
    if(address()&&!connecting()){
      return true
    }else{
      return false
    }
  })
  const wallet = createMemo(()=>{
    if(connected()){return sdk()}
  })

  const initwallet = async({appInfo=configs().appInfo,permissions = configs().permissions, gateWay = configs().gateWay})=>{
    
  
    <Portal mount={document.body}>
      {/* connect */}
      <Modal
        ref={connector}
        id="ar-connector"
        mask
      >
        <ModalHeader title={mode()&&mode()=="list"?"Connect to a wallet":"Connecting..."} disabled = {mode()&&mode()=="connecting"||connecting()}/>
        {/* <div class="text-lg pb-4 flex justify-between items-center w-full">
          <Icon icon="iconoir:wallet" class="text-current/50"></Icon>
          <h2 class="text-current/50">{mode()&&mode()=="list"?"Connect to a wallet":"Connecting..."}</h2>
          <button 
            class="btn btn-ghost btn-icon hover:bg-transparent hover:text-current"
            onClick={()=>connector.close()}
            disabled = {mode()&&mode()=="connecting"||connecting()}
          >
            <Icon icon="carbon:close" />
          </button>
          
        </div> */}
        <ModalContainer class="p-[1em]">
        <Switch>
          <Match when={mode()&&mode()=="list"}>
            <div class="flex flex-col items-center gap-2 w-[20em]">
            <For each={enables()?.filter((i)=>i.type=="web3")}>
              {(item)=>{
                return(
                <button 
                  class="btn h-[3em] rounded-xl  w-full flex justify-between items-center" 
                  classList={{
                    "hover:bg-base-100 text-current" : !item.enable
                  }}
                  onClick={()=>{
                    setCurrentConnectingInfo(item)
                    setMode("connecting")
                    connect(item.key)
                    .then((res)=>{
                      console.log("链接结果",res)
                      if(res?.connected){
                        connector.close()
                        toast.success(<div class="w-[18em]">Connected to {shortStr(res.address,4)}</div>)
                      }
                    })
                    .catch((err)=>{
                      console.log("链接中断",err)
                    })
                    .finally(()=>{
                      console.log("链接完成")
                      setMode("list")
                      setCurrentConnectingInfo(null)
                    })
                  }
                  }
                >
                  <span class="inline-flex gap-2 items-center" classList={{
                    "opacity-50" : !item.enable 
                  }}>
                    <image src={item.logo} class="size-6 bg-[#000000] p-1 rounded-full border border-current/50"/>{item.name} 
                  </span>
                  <span class="text-xs capitalize bg-base-0/50 inline-flex rounded-full py-1 px-2 uppercase" classList={{
                    "text-[#00ff00]" : item.enable
                  }}>
                    {item.enable?"Installed":"Install"}
                  </span>
                </button>
                )
              }}
            </For>

            <span class="text-current/50">or</span>

            <button 
              class="w-full rounded-xl flex justify-between items-center h-[3em] btn"
              onClick={()=>{
                setCurrentConnectingInfo({
                  logo:"https://228480384-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/organizations%2FH1lMs0EXPi5W7DrBLxCk%2Fsites%2Fsite_EwgSU%2Ficon%2FNUQqw17QN3bI11zZ3Otq%2Ficon.svg?alt=media&token=366bb4df-990c-4641-84fa-e2575a74470b"
                })
                setMode("connecting")
                connect("othent")
                  .then((res)=>{
                    if(res.connected){
                      connector.close()
                      toast.success(<div class="w-[18em]">Connected to {shortStr(res.address,4)}</div>)
                    }
                  })
                  .catch((err)=>{
                    console.log(err)
                  })
                  .finally(()=>{
                    setMode("list")
                    setCurrentConnectingInfo(null)
                  })
              }}
            >
              <div>Continue with</div>
              <div class="inline-flex gap-2">
                <image class="size-4 rounded-full border border-current/50" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAvVBMVEVHcEz8/f3////////+/v7s7u/6+vr5+vr5+vr9/f3////////5+vr////////Kzs/////////9/v74+fn4+fn////8vwbsTkJFiPPrQjI7q1gpp00yqVPrSTlAhfX9/f2hv/nwgHj2tLGt2bkqe/Q2gPV+qPd7woza5f2WuPns8v5ZtnHD48n92Yj80Wn+6sD4yMXtZ13znpn8xSnwuh3v6+WIwbFwoPb0qKPpKxT1mx7AtydjuXgcpjNCk8nTYqeQAAAAFXRSTlMA5d2fnApdnVLJpWJiowsJZNGXl5g9ng+vAAABP0lEQVQokY2S2XqCMBCFQVGWulRbkIRABASK0FZtq3Z9/8fqZCDK0oueCzJf/sxhJhlF+Z/G1kJVF9a4T2ZD+6LhrM1u7ZZumsyyO5pe2RQ3+O4Qhoddbd32jHzigwiJms4jTAvJqtb7GekIoSbC0F+tCNnvCSFhZawhRE/I84UfP4eyKMEMEXxA3lunYqN2fXZe/ajbjvA1YX10HIeLjXyNyrcQmwAHsD45zgue3gSozQPEgx50UYmELdtTmqYngNJ2WRVEY1nIOnATsS5lK5+MenUr28ANUtmKIvxij1KGuaUbuFgPxxvSxd4Xo9TzisLz2E+SS1e4eCylgFzK4Aj7PuJLVBevTPBfMSQxBp+qsol8UK167DLLsmNZlaVfR0Hv3muDwVjyJuKd8ZzrF8z1eX90jXtTVc07o0/+1C9hwDM1yvfWEgAAAABJRU5ErkJggg=="/>
                <image class="size-4 rounded-full border border-current/50" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAb1BMVEX////4+Pi3ubtvcnZNUVU+Q0cpLjLr6+x3en0sMTYkKS59gIORk5aUl5n8/Pzw8PFTV1tbX2Pc3d5DSEzn5+g3PECLjpFKTlKFh4qxs7XCxMUuMze/wcLh4uPV1tZzd3o/Q0jOz9CmqKpjZ2qfoaTxAyfNAAABPUlEQVR4AW3TBYKDMBQE0AltAgzuzur9z7ibH5oKfWjc4UEFl6s2Rl8vgcJZGMX04iTEM5UaPomzHA+KkidVAa/WfKNpffMd32oKCHUlWfb27Q19ZSMVrNHGTMDckMtQLqSegdXGpvi3Sf93W9UudRby2WzsEgL4oMvwoqY1AsrQNfFipbXkCGh1BV6oT1pfRwvfOJlo9ZA5NAonStbmB1pawBuDTAgkX4MzV/eC2H3e0C7lk1aBEzd+7SpigJOZVoXx+J5UxzADil+8+KZYoRaK5y2WZxSdgm0j+dakzkIc2kzT6W3IcFnDTzdt4sKbWMqkpNl229IMsfMmg6UaMsJXmv4qCMXDoI4mO5oADwyFDnGoO3KI0jSHQ6E3eJum5TP4Y+EVyUOGXHZjgWd7ZEwOJzZRjbPQt7mF8P4AzsYZpmkFLF4AAAAASUVORK5CYII="/>
                <image class="size-4 rounded-full border border-current/50" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC5UlEQVR4Aa1XQ3hkQRjc+ynX2OZtbfu+tm3b1nlt27a9O4qNS5xxbdd+cTKvXydT31fJoPuvmvf6/ejw86dBlX6CwwQXCq6t5cLaz/xV4+ld6F8r9NdgsCAjIwf5+UUoLCwBydf8jN+JNQbBddzjDQM+gocErRSyWm2QgWu4lntq9/q01UAfwYKCgmK43W6ognu4lzEE+6oamCboLC0tR3vBGIwlOF2vgZm5uQWoqamBXrhcLpw5cxZ79uxFKxCxrGBMxpYZ6Eu33KAXNDp+/AQEBgbzv8Y6Kxi7+e1ofuAKVS/7zp27KE7i6dNnem5HAbVaM3CYh0YF/PWRkdEUpxHoQe3BPNTcQJCgTc9pT0tLh8VigdPpBLFv3368evVKBC7A16/fkJmZKX06qCXo39jAej67Wnjx4iVGjBiJ0NBwBAeHYsCAgTh48BCuXLmCKVOmIioqBrwS4eGRGDduPMxmMzyBWtRsbMCglWSePXuOkJAwCuhmnz79YLVaPSUrGjDWGQhgCvWEyspKdOrURUk8JiYO799/0Exg1KQ2DQxjHveEO3fuKomTPBcyUJPaNLCQxcQTNm3arGzAYDBABmoK7UU0sE7rAC5dukxJPCgoRPy6DMhATWpLDWzbtl35Cty//0DBgOQW3LhxU9nAsGEj4HA4dN0CySHkwvy6bKfECRMmISsrS34IZY8hMXnyFAZV5rFjx6WPoa5E9PnzZ2XxpKQUlJaWaiUik1IqXrBgkZKB06fPwBOKiv4fwA3Ni5FdK3NVVFSgd+++usRnzJilXIzII7JynJOTAxaa7t17Yt68+bh37z6+fPmKCxcuYvToMejVqzdWrVrNMi0rx4cVGxIFKDQkCi2ZAhRaMklTavWqeF6epCltxuneasvLyurb8lmqg0lfLw4m/dozmh0RtBUV6R/NuJZ7avf6eGs4ZeIwMoVmZrYcTvkZv+MarlUZTlUZIDi8diRfX8uFtZ8FqMb7Bx+2VJbBTrlcAAAAAElFTkSuQmCC"/>
                <Icon icon="iconoir:more-horiz"></Icon>
              </div>
            </button> 
            </div>
          </Match>
          <Match when={mode()=="connecting"}>
              <div class="flex flex-col items-center gap-2 w-[20em] p-4 justify-center min-h-16">
                <div class="bg-[#000] border rounded-full size-24 flex items-center justify-center">
                  <image src={currentConnectingInfo().logo} class="size-10"></image>
                </div>
                <div><Spinner/></div>
              </div>
          </Match>
        </Switch>
        
        <div class="w-full text-center text-sm p-2 "><span class="text-current/50">Don't have a wallet?</span> <a target="_blank" href="https://2hsfyi4t5fiqdcanybdez4e4admrjeqghts22viz7uuo3d5k2nna.arweave.net/0eRcI5PpUQGIDcBGTPCcANkUkgY85a1VGf0o7Y-q01o/#/en/wallets">Get a new</a></div>
        </ModalContainer>
      </Modal>
      {/* disconnect */}
      <Modal
        ref={disconnector}
        mask={true}
        id="ar-disconnctor"
        class="w-60 p-6"
      >
        
        <div>
          <div class="w-full text-center pb-8 flex flex-col items-center gap-2">
            <Icon icon="codicon:debug-disconnect" class="size-16 text-2xl text-base-content/50" />
            <p>Are you sure want to disconnect your wallet?</p>
          </div>
          <div class="flex items-center justify-end gap-2 flex-col w-full px-4 pb-4">
            <button 
              className="btn w-full btn-primary" 
              onClick={()=>{
                setDisconnecting(true)
                disconnect()
                .catch((err)=>console.log(err))
                .finally(()=>{
                  setDisconnecting(false)
                  disconnector.close()
                })
              }}
              disabled={disconnecting()}
            >
              Disconnect
            </button>
            <button 
              className="btn w-full" 
              onClick={()=>disconnector.close()}
              disabled={disconnecting()}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </Portal>
    
    
    await setConfigs({appInfo,permissions,gateWay})
    await setEnables(enables())
    await setInted(true)
    console.log("initwallet",inited(),enables())

    return inited()
  }

  onMount(()=>{
    if(globalThis.arweaveWallet||window.arweaveWallet){
      globalThis.addEventListener("arweaveWalletLoaded",async(e)=>{
        const type = localStorage.getItem("AR-WALLET-TYPE")
        if(type=="arconnect"){
          const permissions = await globalThis.arweaveWallet.getPermissions().catch((err)=>{
            console.log(err,"执行刷新")
            window.location.reload();
            return
          })

          if(permissions?.length == configs()?.permissions?.length){
            const address= await globalThis.arweaveWallet.getActiveAddress()
            if(address){
              setAddress(address)
              setConnecting(false)
              setSdk(globalThis.arweaveWallet)
            }
          }
          
        }
      })
      globalThis.addEventListener("walletSwitch",(e)=>{
        const type = localStorage.getItem("AR-WALLET-TYPE")
        if(type=="arconnect"){
          setAddress(e.detail.address)
          setConnecting(false)
          setSdk(globalThis.arweaveWallet)
        }
      })
    }
  })

  onCleanup(()=>{
    globalThis.removeEventListener("walletSwitch",()=>console.log("Removed walletSwitch listener"))
    globalThis.removeEventListener("arweaveWalletLoaded",()=>console.log("Removed arweaveWalletLoaded listener"))
  })

  



  const connect = async(type = "arconnect",options) =>{
    console.log("connect...",type,connected())
    if(connected()&&inited()) return
    const appInfo = {
      name : options?.appInfo?.name || configs()?.appInfo?.name,
      logo : options?.appInfo?.logo || configs()?.appInfo?.logo,
    }
    const gateWay = {
      host: options?.gateWay?.host || configs()?.gateWay?.host,
      port: options?.gateWay?.port || configs()?.gateWay?.port,
      protocol: options?.gateWay?.protocol || configs()?.gateWay?.protocol,
    }
    const permissions = options?.permissions || configs()?.permissions
    setConnecting(true)
    setSdk(getWalletSdk(type,enables()))
    console.log(sdk())
    switch(type){
      case "arconnect":
      default:
        await globalThis.arweaveWallet.connect(permissions||["ACCESS_ADDRESS","SIGN_TRANSACTION"],appInfo,gateWay)
          .then(async(res)=>{
            console.log("链接成功",res)
            const address = await globalThis.arweaveWallet.getActiveAddress()
            if(address){
              setAddress(address)
              setSdk(globalThis.arweaveWallet)
              localStorage.setItem("AR-WALLET-TYPE","arconnect")
            }
          })
          .catch((err)=>{
            console.log(err)
            window.location.reload();
          })
          .finally(()=>setConnecting(false))
        break;
      case "othent":
        const _othent = new Othent({ 
          appInfo:{
            name: appInfo?.name,
            version: "1.0",
            env: "production",
          },
          persistLocalStorage : true,
          autoConnect : "off"
        })
        if (!_othent.isAuthenticated) {
          appInfo.env = "production"
          appInfo.version = "1.0"
          await _othent?.connect(undefined,appInfo,gateWay)
            .then((res)=>{
              if(res?.walletAddress){
                setAddress(res?.walletAddress)
                setSdk(_othent)
                localStorage.setItem("AR-WALLET-TYPE","othent")
              }
            })
            .catch((err)=>console.log(err))
            .finally(()=>setConnecting(false))
        }
        break;
      case "arweaveapp":
        const _arweavapp = new ArweaveWebWallet({
          name: appInfo?.name,
          logo: appInfo?.logo
        })
        _arweavapp.setUrl("arweave.app")
        await _arweavapp.connect()
          .then((address)=>{
            setAddress(address)
            setSdk(_arweavapp)
            localStorage.setItem("AR-WALLET-TYPE","arweaveapp")
          })
          .catch((err)=>console.log(err))
          .finally(()=>setConnecting(false))
        break;
    }

    return {connected:connected(),address:address()}
  }

  const disconnect = ()=>new Promise(async(resolve, reject) => {
    if(connected()){
      console.log("disconnecting...")
      await sdk()?.disconnect()
      setAddress(null)
      setConnecting(false)
      setSdk(null)
      resolve()
    }else{reject()}
  })

  const createTemporaryWallet = async(options)=>{
    let jwk
    if(localStorage.getItem("AR-TEMP-JWK")){
      jwk = JSON.parse(localStorage.getItem("AR-TEMP-JWK"))
    }else{
      console.log("createTemporaryWallet")
      const arweave = Arweave.init(options?.gateWay||{})
      jwk = await arweave.wallets.generate()
      localStorage.setItem("AR-TEMP-JWK",JSON.stringify(jwk))
    }
    console.log("jwk",jwk)
    
  }

  const walletConnectionCheck = (element,accessor) => {
    element.addEventListener("click",(e)=>{
      if(connected()){
        accessor()?.()
      }else{
        handleConnection()
        e.preventDefault();
      }
    })
  }

  return {
    connecting,
    connect,
    disconnect,
    connected,
    address,
    sdk,
    createTemporaryWallet,
    enables,
    walletConnectionCheck,
    initwallet,
    wallet,
    inited,
    handleConnection :()=>{
      setMode("list")
      connector.open()
    },
    handleDisconnection : () => disconnector.open()
  }
})

