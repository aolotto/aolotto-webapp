import { createSignal,createEffect,createMemo,on,onMount, Show } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { InfoItem } from "./infoitem"
import { shortStr, toBalanceValue } from "../lib/tool"
import { pool,app,agent,currency } from "../signals/global"
import { Multiplier } from "./multiplier"
import Ticker from "./ticker"
import { balances,refetchUserBalances } from "../signals/player"
import { address,wallet } from "./arwallet"
import { AO } from "../lib/ao"
import Spinner from "./spinner"

// components
import { Modal, ModalHeader, ModalContainer, ModalFooter } from "./popup"
import toast from "solid-toast"

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
    const ao = new AO({wallet:wallet()})
    const msg =  await ao.message({
      process: token_id,
      tags: {
        Action: "Transfer",
        Quantity: String(cost),
        Recipient: agent_id || app.agent_id,
        ['X-Numbers']: xnumber,
        ['X-Pool']: pool_id || app.pool_id
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
  const [picked, setPicked] = createSignal([])
  const [quantity, setQuantity] = createSignal()
  const enableMultiplier = createMemo(() => picked()?.join('').length >= 3)
  const [submiting,setSubmiting] = createSignal(false)
  const balance = createMemo(()=>{
    if(address()){
      return balances()?.[currency?.id]
    }
  })
  const cost = createMemo(()=>quantity()*pool?.price)
  const enableSubmit = createMemo(()=>balance()>=cost()&&picked())
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
      },
      close:()=>_number_picker.close(),
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
      {submiting() && <div class="fixed inset-0 bg-base-0 opacity-60 z-50 rounded-2xl" ></div>}
      <ModalHeader>
        <div class="flex items-start justify-between text-xl w-full px-[1em] py-4">
       
          <h2 class="px-2 py-1">Betting on Round {props?.state?.round}</h2>
          <button 
            class="cursor-pointer"
            onClick={()=>{_number_picker.close()}}
            disabled={submiting()}
          >
            <Icon icon="carbon:close" />
          </button>
        </div>
      </ModalHeader>
      <ModalContainer className="sm:px-4 w-full overflow-y-scroll">
        <div class="p-3 border-t border-current/20">
          <InfoItem label={"Player"}><Show when={address()}>{shortStr(address(),6)}</Show></InfoItem>
        </div>
        <section class="border-t border-current/20 last:border-b py-4 flex flex-col gap-6">
          <div class="px-3  flex gap-2 items-center w-full justify-between">
            <div class="flex gap-2 items-center">
              <Show 
                when={picked()?.join("").length>=3} 
                fallback={
                  <span class="text-current/50">Pick 3-digit numbers below</span>
              }>
                <span>
                  <span class="text-current/50">Picked:</span> {picked()} 
                  <button class="btn btn-ghost btn-xs rounded-full btn-icon" onClick={()=>setPicked(generateRandomNumber(3))}>
                    <Icon icon="iconoir:shuffle"></Icon></button>
                </span>
              </Show>
              
            </div>
            <Show when={enableMultiplier()} fallback={
              <button class="btn btn-primary btn-xs rounded-full gap-[0.5em]" onClick={()=>{
                setPicked(generateRandomNumber(3))
              }}>
                <Icon icon="iconoir:shuffle"></Icon>Random
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
              </div>
            </div>
          </div>

          <div class="px-3">
            <InfoItem class="py-[0.1em]" label={"Price"} value={<span>{toBalanceValue(pool?.price,pool?.asset_bet?.[1]||6,1)} <span class="text-current/50"><Ticker>{pool?.asset_bet?.[0]}</Ticker></span> </span>}/>
            <InfoItem class="py-[0.1em]" label={"Multiplier"} value={<Show when={quantity()&&quantity()>0} fallback="-">× {quantity()}</Show>}/>
            <InfoItem class="py-[0.1em]" label={"Cost"} value={<Show when={cost()&&quantity()>0} fallback="-">
              {toBalanceValue(cost() ,pool?.asset_bet?.[1]||6,1)} <span class="text-current/50"><Ticker>{pool?.asset_bet?.[0]}</Ticker></span>
            </Show>}/>
            {/* <InfoItem label={"Cost"} value={<Show when={quantity()&&quantity()>0&&pool?.price} fallback="-">
              {toBalanceValue(cost() ,pool?.asset_bet?.[1]||6,1)} <span class="text-current/50"><Ticker>{pool?.asset_bet?.[0]}</Ticker></span>
            </Show>}/> */}
        </div>
        </section>
        
        <Show when={props?.state?.mining_quota}>
          <div class="px-3 py-4 border-t border-current/20 flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <span class="text-current/50"><Icon icon="ph:arrow-elbow-down-right-light" /> Mining Reward(Est):</span> <Show when={quantity()&&props?.state?.mining_quota} fallback="...">{toBalanceValue(Number(props?.state?.mining_quota[0])/2100*quantity(),12,3)}<Ticker class="text-current/50">{agent.ticker}</Ticker></Show>
            </div>
            
          </div>
        </Show>
        
        
      </ModalContainer>
      <ModalFooter class="px-4">
        <div class="py-6 px-2 flex justify-between items-center border-t border-current/20">
          <div class="px-1 flex flex-col flex-1">
            <span class="text-current/50">Balance:</span>
            <span class=""><Show when={balances.state=="ready"} fallback="...">{toBalanceValue(balance()||0,6,1)} <Ticker class="text-current/50">{pool.ticker}</Ticker></Show> - <a>deposit</a></span>
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
                token_id: currency.id || app.token_id,
                agent_id: agent.id || app.agent_id,
                pool_id: pool.id || app.pool_id,
                numbers: picked(),
                cost: cost()
              })
              .then((msgid)=>{
                refetchUserBalances()
                if(props?.onSubmitted&&typeof(props?.onSubmitted)=="function"){
                  props.onSubmitted(msgid)
                }
                _number_picker.close()
                toast.promise(new Promise((resolve, reject) => {
                  new AO().dryrun({
                    process: pool.id || app.pool_id,
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
                    const mined = val.x_mined&&val.x_mined.split(",")
                    return (
                      <div>
                        Successfully bet <span class="inline-flex bg-current/10 rounded-full px-2 py-1">{val.x_numbers}*{val.count}</span> to round {val.round} <Show when={val.x_mined}> and get mining reward: {toBalanceValue(mined[0],mined[2],2)} ${mined[1]}</Show>! 
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
            {submiting()?<Spinner/>:"Pay"}
          </button>
        </div>
        
      </ModalFooter>
    </Modal>
  )
}