import { createRoot,createSignal, createMemo, onMount,For, Switch, Match, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { ArweaveWebWallet } from 'arweave-wallet-connector'
import { Icon } from "@iconify-icon/solid";
import { toast } from "solid-toast"
import { shortStr } from "../lib/tool";
import Spinner from "./spinner";
import { Modal, ModalContainer, ModalHeader } from "./popup";

let enables = [
  {
    key : "arconnect",
    name: "Wander (Arconnect)",
    desc: "Browser plug-in wallet",
    type: "web3",
    logo: "https://arweave.net/Wc6WDwI3TD5qWqtGZemWoBcMp9tOlkQwWF9PdYHGXyk",
    downlink : "https://www.wander.app/download?tab=download-browser",

  },{
    key : "arweaveapp",
    name : "ArweaveApp",
    desc : "Web based wallet",
    type: "web3",
    logo : "https://arweave.net/qVms-k8Ox-eKFJN5QFvrPQvT9ryqQXaFcYbr-fJbgLY",

  }
]


export const {
  connecting,
  connect,
  disconnect,
  connected,
  address,
  wsdk,
  walletConnectionCheck,
  initwallet,
  // wallet,
  handleConnection,
  handleDisconnection,
  inited
} = createRoot(() => {
  let connector
  let disconnector
  const [inited,setInted] = createSignal(false)
  const [wsdk,setWsdk] = createSignal()
  const [connecting,setConnecting] = createSignal(false)
  const [address, setAddress] = createSignal();

  const [error,setError] = createSignal()

  const [title,setTitle] = createSignal("Connect to a wallet")


  const [mode,setMode] = createSignal("list")
  const [currentConnectingInfo,setCurrentConnectingInfo] = createSignal()
  const [disconnecting,setDisconnecting] = createSignal(false)
  const [configs,setConfigs] = createSignal({
    appInfo:{
      name:"Aolotto",
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


  const createPortal = () => {
    <Portal mount={document?.body}>
      {/* connect */}
      <Modal
        ref={connector}
        id="ar-connector"
        mask
      >
        <ModalHeader 
          title={title()} 
          disabled = {(mode()&&mode()=="connecting")||connecting()}/>
        <ModalContainer class="p-[1em]">
        <Switch>
          <Match when={mode()&&mode()=="list"}>
            <div class="flex flex-col items-center gap-2 w-[20em]">
              <For each={enables}>
                {(item)=>{
        
                  return(
                  <button 
                    class="btn h-[3em] rounded-xl  w-full flex justify-between items-center" 
                    onClick={()=>{
                      if(item.key=="arconnect"){
                        if(!window?.arweaveWallet){
                          setTitle("Arconnect not found")
                          setError("Arconnect not found, please install it first.")
                          setMode("error")
                          return
                        }
                      }
                      setCurrentConnectingInfo(item)
                      setTitle(`Connecting...`)
                      setMode("connecting")
                      connect(item.key)
                      .then((res)=>{
                        if(res?.connected){
                          connector.close()
                          toast.success(<div class="w-[18em]">Connected to {shortStr(res.address,4)}</div>)
                        }
                      })
                      .catch((err)=>{
                        console.log("connect refuse",err)
                      })
                      .finally(()=>{
                        setTitle("Connect to a wallet")
                        setMode("list")
                        setCurrentConnectingInfo(null)
                      })
                    }
                    }
                  >
                    <span class="inline-flex gap-2 items-center">
                      <image src={item.logo} class="size-6 bg-[#000000] p-1 rounded-full border border-current/50"/>{item.name} 
                    </span>
                 
                  </button>
                  )
                }}
              </For>

      
            </div>
          </Match>
          <Match when={mode()&&mode()=="connecting"}>
              <div class="flex flex-col items-center gap-2 w-[20em] p-4 justify-center min-h-16">
                <div class="bg-[#000] border rounded-full size-24 flex items-center justify-center">
                  <image src={currentConnectingInfo()?.logo} class="size-10"></image>
                </div>
                <div><Spinner/></div>
              </div>
          </Match>
          <Match when={mode()&&mode()=="error"}>
              <div class="flex flex-col items-center gap-2 w-[20em] p-4 justify-center min-h-16">
                {error()}
                <div class="flex items-center justify-center gap-2">

                <button class="btn" onClick={()=>{
                  setTitle("Connect to a wallet")
                  setMode("list")
                  setError(null)
                }}> Back </button>
                <a class="btn btn-primary" href="https://www.arconnect.io/download" target="_blank">Install</a>

                </div>
                
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
                    disconnector?.close()
                  })
              }}
              disabled={disconnecting()}
            >
              Disconnect
            </button>
            <button 
              className="btn w-full" 
              onClick={()=>disconnector?.close()}
              disabled={disconnecting()}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </Portal>
  }

  const initwallet = ({
    appInfo,
    permissions,
    gateWay
  })=>{
    setConfigs({appInfo,permissions,gateWay})
    setInted(true)
    return true
  }

  onMount(()=>{
    createPortal()
    const type = localStorage?.getItem("AR-WALLET-TYPE")
    try {
      if(window?.arweaveWallet){
        console.log("Arweave wallet found")
        if(type=="arconnect"){setConnecting(true)}
        window.addEventListener("arweaveWalletLoaded",async(e)=>{
          if(type=="arconnect"){
            connect("arconnect",configs())
          }else{
            setConnecting(false)
          }
        })
        window.addEventListener("walletSwitch",(e)=>{
          const type = localStorage?.getItem("AR-WALLET-TYPE")
          if(type=="arconnect"){
            setAddress(e.detail.address)
            setConnecting(false)
            setWsdk(window.arweaveWallet)
          }
        })
      }
    } catch (error) {
      console.log(error)
      setConnecting(false)
    }
    
    
  })

  onCleanup(()=>{
    window.removeEventListener("walletSwitch",()=>console.log("Removed walletSwitch listener"))
    window.removeEventListener("arweaveWalletLoaded",()=>console.log("Removed arweaveWalletLoaded listener"))
  })

  



  const connect = async(type = "arconnect",options) =>{
    
    if(connected()&&inited()) return
    console.log("connecting...")
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
    switch(type){
      case "arconnect":
      default:
        await window?.arweaveWallet?.connect(permissions||["ACCESS_ADDRESS","SIGN_TRANSACTION"],appInfo,gateWay)
          .then(async(res)=>{
            const address = await window?.arweaveWallet?.getActiveAddress()
            if(address){
              setAddress(address)
              setWsdk(window?.arweaveWallet)

              document?.hasStorageAccess()?.then((hasAccess) => {
                if (hasAccess) {
                  localStorage.setItem("AR-WALLET-TYPE","arconnect");
                  console.log("已获得 cookie 访问权限");
                }
              });
            }
          })
          .catch((err)=>{
            console.log(err)
            window.location.reload();
          })
          .finally(()=>setConnecting(false))
        break;
      case "arweaveapp":
        const _arweavapp = new ArweaveWebWallet({
          name: appInfo?.name,
          logo: appInfo?.logo
        })
        if(!_arweavapp) return
        _arweavapp?.setUrl("arweave.app")
        
        await _arweavapp?.connect()
          .then((address)=>{
            setAddress(address)
            setWsdk(_arweavapp)
            document?.hasStorageAccess()?.then((hasAccess) => {
              if (hasAccess) {
                localStorage.setItem("AR-WALLET-TYPE","arweaveapp");
              }
            });
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
      if(!wsdk()){
        reject(false)
      }
      await wsdk()?.disconnect()
      setAddress(null)
      setConnecting(false)
      setWsdk(null)
      resolve(true)
    }else{reject(false)}
  })


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
    wsdk,
    walletConnectionCheck,
    initwallet,
    // wallet,
    inited,
    handleConnection :()=>{
      setMode("list")
      connector?.open()
    },
    handleDisconnection : () => disconnector?.open()
  }
})

