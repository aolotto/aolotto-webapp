import { setDictionarys,t } from "../i18n"
import { createEffect, createSignal, Match, onMount, Switch, createMemo, from } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { InfoItem } from "./infoitem"
import {  toBalanceValue } from "../lib/tools"
import Spinner from "./spinner"
import { useWallet } from "arwallet-solid-kit"
import { useApp,useUser } from "../contexts"
import Modal from "./modal"
import { submitStaking } from "../api"

// import {stake_state,refetchStakeState,refetchStaker, staker, balances } from "../data/resouces"
import toast from "solid-toast"



export default props => {
  let _locker
  const {wallet} = useWallet()
  const { altBalance,refetchAltBalance } = useUser()
  const {info} = useApp()

  setDictionarys("en",{
    "lk.title_new" : "Create your locking",
    "lk.title_update" : "Update your locking",
    "cancel" : "Cancel",
    "submit" : "Submit",
    "tk.desc" : (v)=><span> Lock <b className="text-base-content">{v[0]}</b> $ALT for <b className="text-base-content">{v[1]}</b> days</span>,
    "tk.locked" : "Total Locked",
    "tk.unlock_time" : "Unlock Time",
    "tk.boosting" : "Boosting",
  })
  setDictionarys("zh",{
    "lk.title_new" : "创建您的锁仓",
    "lk.title_update" : "更新您的锁仓",
    "cancel" : "取消",
    "submit" : "确认",
    "tk.desc" : (v)=><span> 锁定 <b className="text-base-content">{v[0]}</b> $ALT <b className="text-base-content">{v[1]}</b> 天</span>,
    "tk.locked" : "锁仓总量",
    "tk.unlock_time" : "解锁日期",
    "tk.boosting" : "锁仓加速"
  })


  const [mode,setMode] = createSignal("new")
  const [submission,setSubmission] = createSignal()
  const [submitting,setSubmitting] = createSignal()
  
  onMount(()=>{
      props.ref({
        open:(data)=>{
          console.log("确认锁仓",data)
          setMode(data?.staker?"update":"new")
          setSubmitting(false)
          setSubmission(data)
          _locker.open()
        },
        close:()=>{
          setSubmitting(false)
          setSubmission(null)
          _locker.close()
        },
      })
      
    })
  return(
    <Modal
      id="locker"
      title={mode() == "new"?t("lk.title_new"):t("lk.title_update")}
      className="w-[360px] max-[360px]"
      ref={_locker}
      disclosable = {submitting()}
    >
      <section className="px-6 py-2 w-full">
        {/* <div className="flex items-center gap-2 justify-center border-y border-base-300 py-4"> 
          <div className="flex flex-col items-center flex-1">
            <span className="text-lg">{toBalanceValue(submission()?.amount,12)}</span> <span className="text-xs text-current/50">$ALT</span>
          </div>
          <span>→</span>
          <div className="flex flex-col items-center flex-1">
            <span className="text-lg">{toBalanceValue(submission()?.amount * Math.min(submission()?.duration/(1440*24*60*60*1000),1) * (submission()?.staker?.boost||1) ,12)}</span> <span className="text-xs text-current/50">veALT</span>
          </div>
        </div> */}
        <div className="flex items-center gap-2 justify-center border-y border-base-300 py-4">
          <Icon icon="basil:lock-outline" />
          {t("tk.desc",[toBalanceValue(submission()?.amount,12,12),submission()?.duration / (24*60*60*1000)])}
        </div>
        <div className=" py-4 px-1">
          <InfoItem label={t("tk.locked")} value={<span>{toBalanceValue((submission()?.amount||0)+(submission()?.staker?.amount || 0),12)} <span class="text-current/50">$ALT</span></span>} className="text-sm"/>
          <InfoItem label={t("tk.unlock_time")} value={()=>new Date(Date.now()+(submission()?.duration || 7*24*60*60*1000)).toLocaleString()} className="text-sm"/>
          <InfoItem label={t("tk.boosting")} value={submission()?.staker?.boost || "1X"} className="text-sm"/>
          {/* <InfoItem label="锁仓余额" value={<span>{toBalanceValue((submission()?.amount + (props?.staker?.amount || 0)) * Math.min(submission()?.duration/(1440*24*60*60*1000),1) * (submission()?.staker?.boost||1) ,12,12)} <span className="text-current/50">veALT</span></span>} className="text-sm"/> */}
        </div>
        <div className="flex justify-between items-center py-4 border-t border-base-300">
          <div className="flex items-center gap-2">
            <Icon icon="ph:arrow-elbow-down-right-light" className="ml-1 text-current/50 scale-90"/>
            <div className="flex flex-col">
              <span>{toBalanceValue((submission()?.amount + (submission()?.staker?.amount || 0)) * Math.min(submission()?.duration/(1440*24*60*60*1000),1) * (submission()?.staker?.boost||1) ,12)} </span>
              <span className="text-current/50 text-xs">veALT</span>
            </div>
          </div>
          <div>
            <button 
              disabled={submitting()} 
              className="btn btn-primary"
              onClick={async()=>{
                setSubmitting(true)
                if(altBalance()>= submission()?.amount){
                  console.log("提交锁仓",submission())
                  submitStaking({
                    agent_id : info.agent_process,
                    stake_id : info.stake_process,
                    quantity : submission()?.amount,
                    duration : submission()?.duration,
                    wallet : wallet()
                  })
                  .then((res)=>{
                    console.log(res)
                    _locker.close()
                    if(props?.onSubmited){
                      props.onSubmited(res)
                    }
                  })
                  .catch((err)=>{
                    console.error(err)
                  })
                  .finally(()=>setSubmitting(false))
                }else{
                  toast.error("Insufficient balance")
                  setSubmitting(false)
                  _locker.close()
                }
                
              }}
            >
              {submitting()?<Spinner/>:t("submit")}
            </button>
          </div>
        {/* <div className="flex justify-end items-center gap-2 w-full">
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
                          agent_id : info.agent_process,
                          stake_id : info.stake_process,
                          quantity : submission()?.amount,
                          duration : submission()?.duration,
                          wallet : wallet
                        })
                        .then((res)=>{
                          console.log(res)
                          _locker.close()
                          if(props?.onSubmited){
                            props.onSubmited(res)
                          }
                          toast.error("Insufficient balance")
                        })
                        .catch((err)=>{
                          console.error(err)
                        })
                        .finally(()=>setSubmitting(false))
                      }else{
                        setSubmitting(false)
                        _locker.close()
                      }
                      
                    }}
                  >
                    {submitting()?<Spinner/>:t("submit")}
                  </button>
                </div>
           */}
        </div>
      </section>
    </Modal>
  )
}