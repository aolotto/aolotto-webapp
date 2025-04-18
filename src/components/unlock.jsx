import { createEffect, createMemo, createSignal, Match, onMount, Show, Switch } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { InfoItem } from "./infoitem"
import { AO } from "../lib/ao"
import { protocols } from "../data/info"
import toast from "solid-toast"
import { wsdk,address } from "./wallet"
import { toBalanceValue } from "../lib/tool"
import { createStore } from "solid-js/store"

const Unlock = ({
  stake_id,
}) => new Promise(async(resovle,reject)=>{
  try {
    console.log("unlocking......")
    if(!stake_id){
      reject(new Error("Missed stake id"))
    }
    const ao = new AO({wallet:wsdk()})
    const tags = {
      Action: "Unstake"
    }

    const msg =  await ao.message({
      process: stake_id,
      tags
    })
    if(!msg){reject("Send message error")}
    const {Messages} = await ao.result({
      process: stake_id,
      message: msg
    })
    console.log(Messages)
    if(!Messages||Messages?.length<1){
      reject(new Error("Transaction error"))
    }else{
      console.log
      resovle(msg)
    }
  } catch (error) {
    reject(error)
  }
})
export default props => {
  let _unlock
  const [unlocking,setUnlocking] = createSignal(false)
  const [mode,setMode] = createSignal("unlock")
  const [fields, setFields] = createStore({})
  const enable_submit = createMemo(() => {
    return fields?.address == address()
  })
  onMount(() => {
    props.ref({
      open: () => {
        setFields({})
        setMode("unlock")
        setUnlocking(false)
        _unlock.showModal()
      },
      close: () => {
        setFields({})
        setMode("unlock")
        setUnlocking(false)
        _unlock.close()
      },
    })
  })
  const receive = createMemo(()=>{
    if(!props?.staker?.start_time){
      return {
        amount: 0,
        penalty: 0
      }
    }
    const rate = Math.min((Date.now() - props?.staker?.start_time) / props?.staker?.locked_time,1)
    return {
      amount: props?.staker?.amount * rate,
      penalty: props?.staker?.amount * (1-rate)
    }
  })
  return (
    <dialog
      id="locker"
      className="modal"
      onCancel={(e) => {
        e.preventDefault()
        return
      }}
      ref={_unlock}
    >
      <div className="modal-backdrop backdrop-blur-2xl"></div>
      <Switch>
        <Match when={mode() === "unlock"}>
          <div className="modal-box rounded-2xl max-w-[360px]">
            {/* top */}
            <section className="modal-top	">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button
                  className="btn btn-circle btn-ghost absolute right-2 top-4"
                  disabled= {unlocking()}
                >
                  <Icon icon="iconoir:cancel" class=" scale-150"></Icon>
                </button>
              </form>
              <h3 className="text-lg">Unlock</h3>
            </section>
            {/* main */}
            <section class="pt-6">
              <p>
              Unstaking before the lock-up expires will incur a penalty, which will be burned.
              </p>
              <div class="pt-4">
              <InfoItem label={"Amount"} class="text-sm"> {toBalanceValue(props?.staker?.amount,12,12)} $ALT</InfoItem>
              <InfoItem label={"Unlock time"} class="text-sm"> {new Date(props?.staker?.start_time + props?.staker?.locked_time)?.toLocaleString()}</InfoItem>
              <InfoItem label={"Penalty"} class="text-sm"> -{toBalanceValue(receive()?.penalty,12,12)} $ALT</InfoItem>
              </div>
              
            </section>
            {/* action */}
            <section className="modal-action justify-between items-center">
              <div>
                <p class="text-xs uppercase text-current/50">Received</p>
                <p>{toBalanceValue(receive()?.amount,12,12)} $ALT</p>
              </div>
              <button
                className="btn btn-error"
                disabled={receive()?.amount<=0}
                onClick={()=>{
                  setMode("confirm")
                }}
              >
                Unlock
              </button>
            </section>
          </div>
        </Match>
        <Match when={mode() === "confirm"}>
          <div className="modal-box rounded-2xl max-w-[360px]">
            {/* top */}
            <section className="modal-top	">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button
                  className="btn btn-circle btn-ghost absolute right-2 top-4"
                  disabled= {unlocking()}
                >
                  <Icon icon="iconoir:cancel" class=" scale-150"></Icon>
                </button>
              </form>
              <h3 className="text-lg">Enter the address and unlock.</h3>
            </section>
            {/* main */}
            <section class="pt-6 flex flex-col gap-4">
              <p class="text-xs text-current/50">
                <span>{address()}</span>
              </p>
              <textarea className="textarea w-full" placeholder="Input your address" name="address" onChange={(e) => setFields(e.target.name, e.target.value)}></textarea>
            </section>
            <section class="pt-6 flex flex-col gap-4">
              <button
                className="btn btn-error w-full"
                disabled={!enable_submit() || unlocking()}
                onClick={()=>{
                setUnlocking(true)
                Unlock({
                  stake_id: protocols?.stake_id,
                })
                .then((result) => {
                  console.log("unLockeed",result)
                  _unlock.close()
                  if(props?.onSubmited){
                    props.onSubmited(result)
                  }
                  toast.success("Unlocked successfull")
                })
                .catch((err) => {
                  console.log(err)
                })
                .finally(()=>setUnlocking(false))
              }}>{unlocking()?"Unlocking...":"Confirm"}</button>
              <button
                className="btn w-full"
                onClick={()=>{
                  setMode("unlock")
                  setFields("address","")
                }}>Cancel</button>
            </section>
          </div>
        </Match>
      </Switch>
    </dialog>
  )
}