import { createSignal, onMount } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { InfoItem } from "./infoitem"
import { AO } from "../lib/ao"
import { protocols } from "../data/info"
import toast from "solid-toast"
import { wsdk } from "./wallet"

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
  onMount(() => {
    props.ref({
      open: () => {
        setUnlocking(false)
        _unlock.showModal()
      },
      close: () => {
        setUnlocking(false)
        _unlock.close()
      },
    })
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
          <InfoItem label={"Locked amount"} class="text-sm"> 200 $ALT</InfoItem>
          <InfoItem label={"Unlock time"} class="text-sm"> 23/04/2019 11:00:00</InfoItem>
          <InfoItem label={"Penalty"} class="text-sm"> -200 $ALT</InfoItem>
          </div>
          
        </section>
        {/* action */}
        <section className="modal-action justify-between items-center">
          <div>
            <p class="text-xs uppercase text-current/50">Received</p>
            <p>20 $ALT</p>
          </div>
          <button
            className="btn btn-primary"
            disabled={unlocking()}
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
            }}
          >
            {unlocking()?"Unlocking...":"Confirm"}
          </button>
        </section>
      </div>
    </dialog>
  )
}