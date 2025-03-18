import { setDictionarys,t } from "../i18n"
import { createEffect, createSignal, Match, onMount, Switch, createMemo, from } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { protocols } from "../data/info"
import {  wsdk } from "./wallet"
import { InfoItem } from "./infoitem"
import { shortStr, toBalanceValue,getDateTimeString } from "../lib/tool"
import { AO } from "../lib/ao"
import Spinner from "./spinner"

// import {stake_state,refetchStakeState,refetchStaker, staker, balances } from "../data/resouces"
import { ALT,refetchALT } from "../data/resouces"
import toast from "solid-toast"

const submitStaking = ({
  agent_id,
  stake_id,
  quantity,
  duration,
}) => new Promise(async(resovle,reject)=>{
  try {
    if(!agent_id){
      reject(new Error("Missed agent id"))
    }
    const ao = new AO({wallet:wsdk()})
    const tags = {
      Action: "Transfer",
      Quantity: String(quantity),
      Recipient: stake_id || protocols.stake_id,
      ['X-Locked-Time']: String(duration),
      ['X-Transfer-Type'] : "Stake"
    }

    const msg =  await ao.message({
      process: agent_id || protocols.agent_id,
      tags
    })
    if(!msg){reject("Send message error")}
    const {Messages} = await ao.result({
      process: agent_id,
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
  let _locker
  const agent_i = protocols?.details[protocols.agent_id]


  setDictionarys("en",{
    "lk.title" : "Confirm your locking",
    "cancel" : "Cancel",
    "submit" : "Submit",
    "tk.desc" : (v)=><span>You are about to lock <b className="text-base-content">{v[0]}</b> $ALT for <b className="text-base-content">{v[1]}</b> days, Locked position details after confirmation:</span>,
    "tk.locked" : "Locked amount",
    "tk.unlock_time" : "Unlock time",
    "tk.boosting" : "Boosting",
  })
  setDictionarys("zh",{
    "lk.title" : "确认您的锁仓",
    "cancel" : "取消",
    "submit" : "确认",
    "tk.desc" : (v)=><span>您将锁定 <b className="text-base-content">{v[0]}</b> $ALT <b className="text-base-content">{v[1]}</b> 天, 确认提交后的锁仓信息:</span>,
    "tk.locked" : "锁定数量",
    "tk.unlock_time" : "解锁日期",
    "tk.boosting" : "锁仓加速"
  })

  const [submission,setSubmission] = createSignal()
  const [submitting,setSubmitting] = createSignal()
  
  onMount(()=>{
      props.ref({
        open:(data)=>{
         
          setSubmitting(false)
          setSubmission(data)
          console.log(submission()?.duration)
          _locker.showModal()
        },
        close:()=>{
          setSubmitting(false)
          setSubmission(null)
          _locker.close()
        },
      })
      
    })
  return(
    <dialog
      id="locker"
      className="modal"
      onCancel={(e)=>{
        e.preventDefault()
        return
      }}
      ref={_locker}
    >
      <div className="modal-backdrop backdrop-blur-2xl"></div>
      <div className="modal-box rounded-2xl max-w-[400px]">
        {/* top */}
        <section className="modal-top	">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-circle btn-ghost absolute right-2 top-4"
              disabled={submitting()}
            >
              <Icon icon="iconoir:cancel" class=" scale-150"></Icon>
            </button>
          </form>
          <h3 className="text-lg">{t("lk.title")}</h3>
        </section>
        {/* main */}
        <div>
        <div className="px-1 py-6 w-full">
                <div  className=" text-sm text-current/50">
                {t("tk.desc",[toBalanceValue(submission()?.amount,12,12),submission()?.duration / (24*60*60*1000)])}
                {/* You are about to lock <b className="text-base-content">{toBalanceValue(submission()?.amount,12,12)}</b> $ALT for <b className="text-base-content">{submission()?.duration / (24*60*60*1000)}</b> days, Locked position details after confirmation: */}
                </div>
                <div className=" pt-4">
                  <InfoItem label={t("tk.locked")} value={<span>{toBalanceValue((submission()?.amount||0)+(submission()?.staker?.amount || 0),12,12)} <span class="text-current/50">$ALT</span></span>} className="text-sm"/>
                  <InfoItem label={t("tk.unlock_time")} value={()=>new Date(Date.now()+(submission()?.duration || 7*24*60*60*1000)).toLocaleString()} className="text-sm"/>
                  <InfoItem label={t("tk.boosting")} value={submission()?.staker?.boost || "-"} className="text-sm"/>
                  <InfoItem label="veBalance" value={<span>{toBalanceValue((submission()?.amount + (props?.staker?.amount || 0)) * Math.min(submission()?.duration/(1440*24*60*60*1000),1) * (submission()?.staker?.boost||1) ,12,12)} <span className="text-current/50">veALT</span></span>} className="text-sm"/>
                </div>
              </div>

          
        </div>
        {/* bottom */}
        <section className="modal-action flex justify-between items-center">
        <div className="flex justify-end items-center gap-2 w-full">
                  <button 
                    className="btn"
                    onClick={()=>_locker.close()}
                    disabled={submitting()}
                  >
                    {t("cancel")}
                  </button>
                  <button 
                    disabled={submitting()} 
                    className="btn btn-primary"
                    onClick={async()=>{
                      setSubmitting(true)
                      await refetchALT()
                      if(ALT()>= submission()?.amount){
                        submitStaking({
                          agent_id : protocols?.agent_id,
                          stake_id : protocols?.stake_id,
                          quantity : submission()?.amount,
                          duration : submission()?.duration
                        })
                        .then((res)=>{
                          console.log(res)
                          _locker.close()
                          if(props?.onSubmited){
                            props.onSubmited(res)
                          }
                          toast.success("Insufficient balance")
                        })
                        .catch((err)=>{
                          console.error(err)
                        })
                        .finally(()=>setSubmitting(false))
                      }else{
                        setSubmitting(false)
                        _locker.close()
                        toast.error("i")
                      }
                      
                    }}
                  >
                    {submitting()?<Spinner/>:t("submit")}
                  </button>
                </div>
          
        </section>
      </div>
    </dialog>
  )
}