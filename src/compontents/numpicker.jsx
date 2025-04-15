import { onMount,createSignal, splitProps, createMemo,createEffect, onCleanup } from "solid-js";
import Dialog from "./dialog";
import { Icon } from "@iconify-icon/solid";
import { t,setDictionarys} from "../i18n"
import { InfoItem } from "./infoitem";
import { Multiplier } from "./multiplier";
import { useWallet } from "arwallet-solid-kit";
import { useApp,useUser } from "../contexts";
import { shortStr, toBalanceValue } from "../lib/tools";
import Spinner from "./spinner";
import Mintlevel from "./mintlevel";
import { postBet } from "../api";
import { AO } from "../api";
import DepositUSD from "./depositUSD";



export default props => {
  let _number_picker
  let _numpick_listner
  setDictionarys("en",{
    "np.title" : (v)=> "Bet on Round-"+v,
    "np.account" : "Account",
    "np.pick_tip" : "Picks a 3-digit number",
    "price" : "Price",
    "multiplier" : "Multiplier",
    "np.bets" : "Quantity",
    "cost" : "Total Cost",
    "buy" : "Buy",
    "random" : "Random",
    "balance" : "Balance",
    "deposit" : "Deposit",
    "picked" : "Picked",
    "np.minting_reward" : "Minting Reward",
    "np.buff_release" : "ALTb Buffs",
    "np.buff_faucet_tip" : ()=> <span>Claim ALTb via <a href="https://docs.aolotto.com/en/faucet" target="_blank">faucet</a></span>,
    "np.pick_count" : (v)=><span>appeared in <span class="inline-flex text-base-content">{v}</span> bets</span>,
    "np.pick_count_tip" : "Picks a number to show bet count",
    "in_balance" : "in balance",
    "bet_sucess" : (v)=> <span>Bet <span class="inline-flex bg-current/10 rounded-full px-2 py-1">{v.val.x_numbers}*{v.val.count}</span> to round {v.val.round} <Show when={v.mint}> and minted: {toBalanceValue(v.mint.total,v.mint.denomination,12)} ${v.mint.ticker}</Show></span>,
    "np.tap_tip" : "Double-tap to randomize.",
    "np.press_r" :  <span>Press <span className="kbd kbd-sm">R</span> to randomize</span>
  })
  setDictionarys("zh",{
    "np.title" : (v)=> "投注到第"+v+"轮",
    "np.account" : "账户",
    "np.pick_tip" : "從下面選擇3位數號碼",
    "price" : "单价",
    "multiplier" : "倍数",
    "cost" : "总价",
    "buy" : "购买",
    "random": "随机",
    "balance" : "余额",
    "deposit" : "储值",
    "picked" : "选中",
    "np.bets" : "投注数量",
    "np.minting_reward" : "铸币奖励",
    "np.buff_release" : "ALTb加成",
    "np.buff_faucet_tip" : ()=> <span>通过<a href="https://docs.aolotto.com/cn/shui-long-tou" target="_blank">水龙头</a>领取ALTb</span>,
    "np.pick_count" : (v)=><span>出现在<span class="inline-flex text-base-content">{v}</span>次投注中</span>,
    "np.pick_count_tip" : "选择号码查看已投注数量",
    "in_balance" : "的余额",
    "bet_sucess" : (v)=><span>成功投注<span class="inline-flex bg-current/10 rounded-full px-2 py-1">{v.val.x_numbers}*{v.val.count}</span>到第{v.val.round}轮 <Show when={v.mint}> 并铸币: {toBalanceValue(v.mint.total,v.mint.denomination,12)} ${v.mint.ticker}</Show></span>,
    "np.querying" : "查询投注结果...",
    "np.tap_tip" : "雙擊隨機選號",
    "np.press_r" :  <span>按鍵 <span className="kbd kbd-sm">R</span> 隨機選號</span>
  })
  const [{pool},others] = splitProps(props,["pool"])
  const { address,walletConnectionCheck,wallet } = useWallet()
  const { poolProcess,info,notify } = useApp()
  const { usdcBalance, refetchUsdcBalance } = useUser()
  const [opened,setOpened] = createSignal(false)
  const [picked, setPicked] = createSignal([])
  const [quantity, setQuantity] = createSignal()
  const [submiting,setSubmiting] = createSignal(false)
  const generateRandomNumber = (digits) => {
    const randomNumbers = [];
    for (let i = 0; i < digits; i++) {
      randomNumbers.push(Math.floor(Math.random() * 10).toString());
    }
    return randomNumbers;
  }
  const enableMultiplier = createMemo(() => picked()?.join('').length >= 3)
  const isMobile = createMemo(()=>window.matchMedia("(max-width: 640px)")?.matches)
  const cost = createMemo(()=>quantity()*Number(poolProcess?.Price||"1000000"))
  const pickedCount = createMemo(()=>pool()?.picks?.[picked()?.join('')]||0)
  const minting = createMemo(()=>{
    const {max_mint,minted,quota} = pool()?.minting || {max_mint:0,minted:0,quota:0}
    const speed = (Number(max_mint) - Number(minted)) / Number(max_mint)
    const per_reward = quota[0] * 0.001 * speed
    if(quantity()>=100){
      return {level:4 ,amount : per_reward * quantity() * 1}
    }
    if(quantity()>=50){
      return {level:3 ,amount : per_reward * quantity() * 0.6}
    }
    if(quantity()>=10){
      return {level:2 ,amount : per_reward * quantity() * 0.3}
    }
    if(quantity()>=1){
      return {level:1 ,amount : per_reward * quantity() * 0.1}
    }
  })
  const enableSubmit = createMemo(()=>{
    if(usdcBalance.state === "ready" && picked()){
      return usdcBalance()>=cost()
    }
  })
  createEffect(()=>{
    if(picked()?.length>=3){
      setQuantity(quantity()||1)
    }
  })
  onMount(()=>{
    props.ref({
      open:(pick)=>{
        if(pick&&pick.length==3){
          setPicked(pick)
          setQuantity(1)
        }
        _number_picker.open()
        setOpened(true)
        if (!isMobile()){
          _numpick_listner = document.addEventListener("keydown", (e)=>{
            if(e.key=="r"&&opened()&&!submiting()){
              setPicked(generateRandomNumber(3))
            }
          });
        }else{
          _numpick_listner = document.addEventListener("dblclick",()=>{
            if(opened()&&!submiting()){
              setPicked(generateRandomNumber(3))
            }
          })
        }
      },
      close:()=>{
        setOpened(false)
        _number_picker.close()
      },
    })
  })

  onCleanup(()=>{
    setOpened(false)
    setSubmiting(false)
    setPicked([])
  })

  
  const handleSubmitTicket = () => {
    setSubmiting(true)
    postBet({
      token_id : info.pay_process,
      agent_id : info.agent_process,
      pool_id : info.pool_process,
      numbers : picked(),
      cost : cost(),
      wallet : wallet()
    })
    .then(async(msgid)=>{
      await refetchUsdcBalance()
      const { Messages } = await new AO().dryrun(info.pool_process,{
        Action : "Query",
        Table : "Bets",
        ['Query-Id'] : msgid
      })
      if(props?.onSubmitted&&typeof(props?.onSubmitted)=="function"){
        let data
        if(Messages?.[0]){
          data = JSON.parse(Messages?.[0]?.Data)
        }
        props.onSubmitted({
          id : msgid,
          data : data
        })
      }
      setOpened(false)
    })
    .catch((err)=>{
      notify("bet error")
    })
    .finally(()=>{
      setSubmiting(false)
    })
  }
  
  return(
    <Dialog ref={_number_picker} id={props?.id} className="w-[480px] h-[600px]" fullscreen responsive title={<span>{t("np.title",pool()?.round)}</span>}>
      <Show when={submiting()}>
        <div className="w-full h-full absolute inset-0 z-1010 bg-base-100/50 backdrop-blur-xl flex items-center justify-center">
          <Spinner className="flex-col justify-center items-center w-full">
            <div className="w-full flex justify-center">
              <p className="text-center w-2/3">Confirm the transaction in the popup window.</p>
            </div>
          </Spinner>
        </div>
      </Show>
      <div className="flex-1 px-4 flex flex-col ">
        <div className="flex flex-col ">
          <div className=" flex items-center justify-center px-2 h-14">
            <soan className="text-current/50">
            <Show when={enableMultiplier()} fallback={t("np.pick_tip")}>
              <span className=" text-base-content">{picked()?.join("")}</span>, {t("np.pick_count",pickedCount()||0)}
            </Show>
            </soan>
          </div>
          <div className="flex md:flex-col px-4 md:py-2 gap-4 rounded-xl ">
            <For each={new Array(props?.digits || 3)}>
              {(n, i) => (
                <div class="w-full flex flex-col md:flex-row  justify-between items-center gap-2">
                  <span class="text-base-content/50 text-xs uppercase">No {i() + 1}</span>
                  <span class="inline-flex flex-wrap gap-2 justify-center w-[80%]">
                    <For each={new Array(10)}>
                      {(b, index) => (
                        <button
                          class="ball ball-sm cursor-pointer ball-outline"
                          classList={{
                            "ball-fill": picked()?.[i()] === index().toString()
                          }}
                          onClick={() => setPicked((arr) => {
                            console.log("arr", arr)
                            const newarr = [...arr]
                            newarr[i()] = index()?.toString()
                            return newarr
                          })}
                        >
                          {index().toString()}
                        </button>
                      )}
                    </For>
                  </span>
                </div>
              )}
            </For>
          </div>
          
          <div className="flex items-center justify-center  h-18">
            <Show when={enableMultiplier()} fallback={
              <span className="text-sm text-current/50 animate-heartbeat">
                {isMobile() ? <span >{t("np.tap_tip")}</span> : t("np.press_r")}
              </span>
            }>
              <Multiplier 
                  min={1} 
                  max={100} 
                  value={quantity()} 
                  onChange={(v) => setQuantity(v)} 
                  disabled={!enableMultiplier()}
                />
            </Show>
          </div>
          {/* mint */}
          <div className="py-6 px-2 border-t border-current/20 w-full">
            <div className="text-center text-sm md:text-md">
              <Show when={!pool.loading} fallback={<span className=" skeleton w-[10em] h-[1em]"></span>}>
                <Mintlevel level={minting()?.level}/>
              <span className="text-current/50"> Bet ${quantity()} to mint <span className="text-base-content">{toBalanceValue(minting()?.amount,12)}</span> $ALT</span>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-circle btn-ghost btn-xs">
                  <svg
                    tabIndex={0}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 stroke-current">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div
                  tabIndex={0}
                  className="card card-sm dropdown-content bg-base-100 rounded-box z-1 w-64 shadow-sm">
                  <div tabIndex={0} className="card-body">
                    <h2 className="card-title">You needed more info?</h2>
                    <p>Here is a description!</p>
                  </div>
                </div>
              </div>
              </Show>
            </div>
          </div>
          {/* cost */}
          <div className="py-4 px-2 border-t border-current/20 w-full">
            <InfoItem label={()=>t("price")}><div className="w-full flex justify-end">${toBalanceValue(1000000,6)}</div></InfoItem>
            <InfoItem label={()=>t("cost")}><div className="w-full flex justify-end">${toBalanceValue(cost(),6)}</div></InfoItem>
          </div>
          <div className="py-4 px-2 border-t border-current/20 w-full text-center">
          <span className="text-current/50 text-sm inline-flex gap-2 items-center"><Icon icon="iconoir:user" /> {shortStr(address()||"",6)}</span>
          </div>
          <div>
            
          </div>
        </div>
        
      </div>
      <div className=" absolute bottom-0  left-0 w-full flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <span class="text-current/50">
            <img src="https://arweave.net/VL4_2p40RKvFOQynAMilDQ4lcwjtlK3Ll-xtRhv9GSY" alt="" className="size-6 rounded-full"/>
          </span>
          <span><Show when={!usdcBalance.loading} fallback={<span className=" skeleton w-[4em] h-[1em] inline-block"></span>}>${toBalanceValue(usdcBalance(),6)}</Show></span>
        </div>
        <div>
          {/* <button 
            className="btn btn-link"
            disabled={submiting()}
          >
            Deposit
          </button> */}
          <DepositUSD className=" dropdown-top"/>
          <button 
            className="btn btn-primary" 
            disabled={!enableSubmit() || submiting()}
            use:walletConnectionCheck={handleSubmitTicket}
          >
            {submiting()?<Spinner/>:t("buy")}
          </button>
        </div>
       
      </div>
    </Dialog>
  )
}