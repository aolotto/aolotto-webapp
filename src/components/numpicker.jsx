import { createSignal,createEffect,createMemo,on,onMount, Show, Switch, Match } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { InfoItem } from "./infoitem"
import { shortStr, toBalanceValue } from "../lib/tool"
import { app,protocols } from "../signals/global"
import { Multiplier } from "./multiplier"
import Ticker from "./ticker"
import { balances,refetchUserBalances,player,refetchPlayer } from "../signals/player"
import { stats } from "../signals/pool"

import { address,wsdk } from "./wallet"
import { AO } from "../lib/ao"
import Spinner from "./spinner"
import { setDictionarys,t } from "../i18n"

// components
import { Modal, ModalHeader, ModalContainer, ModalFooter } from "./popup"
import toast from "solid-toast"
import Recharger from "./recharger"

setDictionarys("en",{
  "np.title" : (v)=> "Bet on Round-"+v,
  "np.account" : "Account",
  "np.pick_tip" : "Picks a 3-digit number",
  "price" : "Price",
  "multiplier" : "Multiplier",
  "np.bets" : "Quantity",
  "cost" : "Cost",
  "random" : "Random",
  "balance" : "Balance",
  "deposit" : "Deposit",
  "np.pay_button" : "Pay",
  "mint" : "Mint",
  "np.pay_token" : "Pay Token",
  "picked" : "Picked",
  "np.minting_reward" : "Minting Reward",
  "np.buff_release" : "ALTb Buffs",
  "np.buff_faucet_tip" : ()=> <span>Claim ALTb via <a href="https://docs.aolotto.com/en/faucet" target="_blank">faucet</a></span>,
  "np.pick_count" : (v)=><span>The number appeared in <span class="inline-flex text-base-content">{v}</span> bets</span>,
  "np.pick_count_tip" : "Picks a number to show bet count",
  "in_balance" : "in balance",
  "bet_sucess" : (v)=> <span>Bet <span class="inline-flex bg-current/10 rounded-full px-2 py-1">{v.val.x_numbers}*{v.val.count}</span> to round {v.val.round} <Show when={v.mint}> and minted: {toBalanceValue(v.mint.total,v.mint.denomination,12)} ${v.mint.ticker}</Show></span>
})
setDictionarys("zh",{
  "np.title" : (v)=> "投注到第"+v+"轮",
  "np.account" : "账户",
  "np.pick_tip" : "從下面選擇3位數號碼",
  "price" : "单价",
  "multiplier" : "倍数",
  "cost" : "总价",
  "random": "随机",
  "balance" : "余额",
  "deposit" : "储值",
  "np.pay_button" : "支付",
  "mint" : "铸币",
  "np.pay_token" : "支付代币",
  "picked" : "选中",
  "np.bets" : "投注数量",
  "np.minting_reward" : "铸币奖励",
  "np.buff_release" : "ALTb加成",
  "np.buff_faucet_tip" : ()=> <span>通过<a href="https://docs.aolotto.com/cn/shui-long-tou" target="_blank">水龙头</a>领取ALTb</span>,
  "np.pick_count" : (v)=><span>该号码出现在<span class="inline-flex text-base-content">{v}</span>次投注中</span>,
  "np.pick_count_tip" : "选择号码查看已投注数量",
  "in_balance" : "的余额",
  "bet_sucess" : (v)=><span>成功投注<span class="inline-flex bg-current/10 rounded-full px-2 py-1">{v.val.x_numbers}*{v.val.count}</span>到第{v.val.round}轮 <Show when={v.mint}> 并铸币: {toBalanceValue(v.mint.total,v.mint.denomination,12)} ${v.mint.ticker}</Show></span>
})
const generateRandomNumber = (digits) => {
  const randomNumbers = [];
  for (let i = 0; i < digits; i++) {
    randomNumbers.push(Math.floor(Math.random() * 10).toString());
  }
  return randomNumbers;
}

const submitBets = ({
  token_id,
  agent_id,
  pool_id,
  numbers,
  cost
}) => new Promise(async(resovle,reject)=>{
  try {
    if(!token_id){
      reject(new Error("Missed token id"))
    }
    const xnumber=numbers.join('')
    const ao = new AO({wallet:wsdk()})
    const msg =  await ao.message({
      process: token_id,
      tags: {
        Action: "Transfer",
        Quantity: String(cost),
        Recipient: agent_id || protocols.agent_id,
        ['X-Numbers']: xnumber,
        ['X-Pool']: pool_id || protocols.pool_id
      }
    })
    if(!msg){reject("Send message error")}
    const {Messages} = await ao.result({
      process: token_id,
      message: msg
    })
    if(!Messages||Messages?.length<2){
      reject(new Error("Transaction error"))
    }else{
      resovle(msg)
    }
  } catch (error) {
    reject(error)
  }
})



export default props => {
  let _number_picker
  const pay_i = protocols.details[protocols?.pay_id]
  const pool_i = protocols.details[protocols?.pool_id]
  const agent_i = protocols.details[protocols?.agent_id]
  const [picked, setPicked] = createSignal([])
  const [quantity, setQuantity] = createSignal()
  const enableMultiplier = createMemo(() => picked()?.join('').length >= 3)
  const [submiting,setSubmiting] = createSignal(false)
  const balance = createMemo(()=>{
    if(address()){
      return balances()?.[protocols?.pay_id]
    }
  })
  const cost = createMemo(()=>quantity()*Number(pool_i?.Price))
  const enableSubmit = createMemo(()=>balance()>=cost()&&picked())
  const pickedCount = createMemo(()=>props?.state?.picks?.[picked()?.join('')]||0)
  const minting = createMemo(()=>{
    if(quantity()>=100){
      return Number(props?.minting?.per_reward) * quantity() * (stats()?.mint_tier?.["100"] || 1)
    }
    if(quantity()>=50){
      return Number(props?.minting?.per_reward) * quantity() * (stats()?.mint_tier?.["50"] || 0.6)
    }
    if(quantity()>=10){
      return Number(props?.minting?.per_reward) * quantity() * (stats()?.mint_tier?.["10"] || 0.3)
    }
    if(quantity()>=1){
      return Number(props?.minting?.per_reward) * quantity() * (stats()?.mint_tier?.["1"] || 0.1)
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
        if(player()){
          refetchUserBalances()
        }
        document.addEventListener("keydown", (e)=>{
          
          if(e.key=="r"){
            console.log("_number_picker",e)
            setPicked(generateRandomNumber(3))
          }
        });
      },
      close:()=>{
        _number_picker.close()
      },
    })
    
  })

  return(
    <Modal
      id="number-picker" 
      ref={_number_picker}
      mask={true}
      onClose={props.onClose} 
      onCancel={(e)=>e.preventDefault()}
      class={"w-128 max-w-full min-w-[360px] h-fit gap-0"}
    >
      {submiting() && <div class="fixed inset-0 bg-base-100 opacity-60 z-50 rounded-2xl" ></div>}
      <ModalHeader>
        <div class="flex items-start justify-between text-xl w-full px-[1em] py-4">
       
          <h2 class="px-2 py-1">{t("np.title",props?.state?.round||1)}</h2>
          <button 
            class="cursor-pointer"
            onClick={()=>{_number_picker.close()}}
            disabled={submiting()}
          >
            <Icon icon="carbon:close" />
          </button>
        </div>
      </ModalHeader>
      <ModalContainer className="sm:px-4 w-full">
        <div class="p-3 border-t border-current/10">
          <InfoItem label={t("np.account")}><Show when={address()}>{shortStr(address(),6)}</Show></InfoItem>
          <InfoItem class="py-[0.1em]" label={t("np.pay_token")} value={<div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center gap-2">
              <image src={`https://arweave.net/${pay_i?.Logo}`} class="w-4 h-4"/> 
              <span class="text-current/50">{pay_i?.Ticker}</span>
            </span>
            <Recharger/>
            {/* <a href="https://aox.xyz/#/cex-deposit/USDC/1" target="_blank" class="inline-flex items-center">{t("deposit")}<Icon icon="ei:external-link"></Icon></a> */}
          </div>}/>
        </div>
        <section class="border-t border-current/10 last:border-b py-4 flex flex-col gap-6">
          <div class="px-3  flex gap-2 items-center w-full justify-between">
            <div class="flex gap-2 items-center">
              <Show 
                when={picked()?.join("").length>=3} 
                fallback={
                  <span class="text-current/50">{t("np.pick_tip")}</span>
              }>
                <span>
                  <span class="text-current/50">{t("picked")}:</span> {picked()} 
                  <button class="btn btn-ghost btn-xs rounded-full btn-icon" onClick={()=>setPicked(generateRandomNumber(3))}>
                    <Icon icon="iconoir:shuffle"></Icon></button>
                </span>
              </Show>

             
              
            </div>
            <Show when={enableMultiplier()} fallback={
              <button class="btn btn-primary btn-xs rounded-full gap-[0.5em]" onClick={()=>{
                setPicked(generateRandomNumber(3))
              }}>
                <Icon icon="iconoir:shuffle"></Icon>{t("random")}
              </button>
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
          <div class="flex px-2 gap-4 items-center justify-between ">
            <div class="flex-1 flex gap-4 flex-col">
              <div class="w-full flex flex-col gap-2 px-1">
                <For each={new Array(props?.digits || 3)}>
                  {(n, i) => (
                    <div class="w-full flex gap-1 md:gap-2 justify-between items-center ">
                      <span class="text-base-content/50 text-sm"><Icon icon="ph:arrow-elbow-down-right-light"></Icon> {i() + 1}</span>
                      <span class="inline-flex gap-2">
                        <For each={new Array(10)}>
                          {(b, index) => (
                            <button 
                              class="ball ball-sm cursor-pointer ball-outline"
                              classList={{ 
                                "ball-fill": picked()?.[i()] === index().toString()
                              }}
                              onClick={() => setPicked((arr) => {
                                console.log("arr",arr)
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

                <div class="text-sm inline-flex items-center justify-end pt-2 text-current/50"><Show when={picked()?.join("").length>=3} fallback={t("np.pick_count_tip")}>{t("np.pick_count",pickedCount())}</Show></div>
              </div>
            </div>
          </div>

          <div class="px-3">
            <InfoItem class="py-[0.1em]" label={t("price")} value={<span>{toBalanceValue(pool_i?.Price,pay_i?.Denomination||6,1)} <span class="text-current/50"><Ticker>{pay_i?.Ticker}</Ticker></span> </span>}/>
            <InfoItem class="py-[0.1em]" label={t("np.bets")} value={<Show when={quantity()&&quantity()>0} fallback="-">× {quantity()}</Show>}/>
            <InfoItem class="py-[0.1em]" label={t("cost")} value={<Show when={cost()&&quantity()>0} fallback="-">
              {toBalanceValue(cost() ,pay_i?.Denomination||6,1)} <span class="text-current/50"><Ticker>{pay_i?.Ticker}</Ticker></span>
            </Show>}/>
        </div>
        </section>
        
        <Show when={props?.minting}>
          <div class="px-3 py-4 border-t border-current/10 flex flex-col gap-2">
              <InfoItem label={t("np.minting_reward")} value={
              <div>
                <Show when={quantity()&&props?.minting} fallback="-">{toBalanceValue(minting(),agent_i.Denomination,12)} <Ticker class="text-current/50">{agent_i.Ticker}</Ticker></Show>
              </div>}/>
              <InfoItem label={t("np.buff_release")} value={<span class="flex flex-col text-xs gap-1 ">
                <span>
                <Show when={quantity()&&props?.minting} fallback="-">
                  + {toBalanceValue(Math.min(minting(),player()?.faucet?.[0]||0),agent_i.Denomination||12,12)} 
                  <Ticker class="text-current/50 ml-2">{agent_i.Ticker}</Ticker>
                </Show>
                </span>
                <Switch>
                  <Match when={!player()?.faucet ||player()?.faucet?.[1] <= 0}>
                  <span class="text-current/50 text-xs border-t border-current/10 pt-1">{t("np.buff_faucet_tip")}</span>
                  </Match>
                  <Match when={player()?.faucet?.[1] > 0}>
                    <span class="text-current/50 border-t border-current/10 pt-1">{toBalanceValue(player()?.faucet?.[0] - Math.min(minting()||0,player()?.faucet?.[0]||0),agent_i.Denomination||12,2)} ALTb {t("in_balance")}</span>
                  </Match>
                </Switch>
                
              
              </span>}/>           
          </div>
        </Show>
        
        {/* <div>dddd</div> */}
        
      </ModalContainer>
      <ModalFooter class="px-4">
        <div class="py-6 px-2 flex justify-between items-center border-t border-current/10">
          <div class="px-1 flex flex-col flex-1">
            <span class="text-current/50">{t("balance")}:</span>
            <span class=""><Show when={balances.state=="ready"} fallback={<Spinner size="sm"/>}>{toBalanceValue(balance()||0,6,1)} <Ticker class="text-current/50">{pay_i.Ticker}</Ticker></Show> </span>
          </div>
          <button
            disabled={balance.loading||!enableSubmit()||submiting()}
            class="btn btn-primary btn-lg"
            onClick={async()=>{
              setSubmiting(true)
              await refetchUserBalances()
              if(balance()<cost()){
                toast.error("Insufficient balance")
                setSubmiting(false)
                return
              }
              submitBets({
                token_id: protocols.pay_id,
                agent_id: protocols.agent_id,
                pool_id: protocols.pool_id,
                numbers: picked(),
                cost: cost()
              })
              .then((msgid)=>{
                refetchUserBalances()
                refetchPlayer()
                if(props?.onSubmitted&&typeof(props?.onSubmitted)=="function"){
                  props.onSubmitted(msgid)
                }
                _number_picker.close()
                toast.promise(new Promise((resolve, reject) => {
                  new AO().dryrun({
                    process: protocols.pool_id,
                    tags : {
                      Action : "Query",
                      Table : "Bets",
                      ['Query-Id']:msgid
                    }
                  })
                  .then(({Messages})=>{
                    if(Messages?.length>0&&Messages?.[0]?.Data){
                      resolve(JSON.parse(Messages[0].Data))
                    }else{
                      reject(new Error("Betting faild."))
                      return
                    }
                  })
                }),{
                  loading: 'Querying Betting Result...',
                  success: (val) => {
                    const mint = val.mint
                    return (
                      <div>
                        {t("bet_sucess",{val,mint})}
                        {/* Bet <span class="inline-flex bg-current/10 rounded-full px-2 py-1">{val.x_numbers}*{val.count}</span> to round {val.round} <Show when={mint}> and minted: {toBalanceValue(mint.total,mint.denomination,2)} ${mint.ticker}</Show>!  */}
                        <a href={`${app.ao_link_url}/#/entity/${val?.id}?tab=linked`} target="_blank">
                          <Icon icon="ei:external-link"></Icon>
                        </a>
                      </div>
                    )
                  },
                  error: "Querying faild."
                })
              })
              .catch((error)=>{
                console.log(error)
              })
              .finally(()=>setSubmiting(false))
            }}
          >
            {submiting()?<Spinner/>:t("np.pay_button")}
          </button>
        </div>
        
      </ModalFooter>
    </Modal>
  )
}