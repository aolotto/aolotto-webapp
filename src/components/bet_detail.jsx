import { Icon } from "@iconify-icon/solid"
import { createEffect, createMemo, createSignal, onMount, Show } from "solid-js"
import { InfoItem } from "./infoitem"
import { shortStr,toBalanceValue } from "../lib/tool"
import { app } from "../signals/global"
import { createSocialShare, TWITTER }  from "@solid-primitives/share";
import Alclogo from "./alclogo"
import { t,setDictionarys } from "../i18n"

export default props => {
  let _detail
  const [info,setInfo] = createSignal()
  const [shareData,setShareData] = createSignal({
    title: app.name,
    url: app.host,
  })

  setDictionarys("en",{
    "detail.title" : "Betting Details",
    "detail.share" : "Share to win",
    "detail.round" : "Round",
    "detail.picked_number" : "Picked Number",
    "detail.amount" : "Amount",
    "detail.minted" : "Minted",
    "detail.gap_rewards" : "Gap-Rewards",
    "detail.created" : "Time",
    "detail.player" : "Player"
  })

  setDictionarys("zh",{
    "detail.title" : "投注详情",
    "detail.share" : "分享赢取",
    "detail.round" : "轮次",
    "detail.picked_number" : "所选号码",
    "detail.amount" : "金额",
    "detail.minted" : "铸币奖励",
    "detail.gap_rewards" : "空当奖励",
    "detail.created" : "下注时间",
    "detail.player" : "用户"
  })

  const [share, close] = createSocialShare(() => shareData());
  const date = createMemo(()=>new Date(info()?.created)?.toLocaleString())
  onMount(()=>{
    props.ref({
      open:(item)=>{
        setInfo(item)
        _detail.showModal()
      }
    })
  })

  return (
    <dialog id="my_modal_1" className="modal rounded-2xl" ref={_detail}>
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2">
            <Icon icon="iconoir:xmark" />
          </button>
        </form>
        <h3 className="font-bold text-lg">🎲 {t("detail.title")}</h3>
        <div className="divider"></div>
        <section className="modal-content p-1">
          <InfoItem label={t("detail.round")} value={()=>`R${info()?.round}`}/>
          <InfoItem label={t("detail.picked_number")} value={()=>info()?.x_numbers}/>
          <InfoItem label={t("detail.amount")} value={()=>`$${toBalanceValue(info()?.amount,6,1)}`}/>
        </section>
        <div className="divider"></div>
        <section className="modal-content p-1 ">
          <InfoItem label={t("detail.minted")}  value={()=>`${toBalanceValue(info()?.mint?.total,12,12)} $ALT`}/>
          <InfoItem label={t("detail.gap_rewards")} value={()=>`${toBalanceValue(info()?.mint?.plus?.[0],12,12)} $ALT`}/>
        </section>
        <div className="divider"></div>
        <section className="modal-content p-1">
          <InfoItem label={t("detail.created")} value={()=>date()}/>
          <InfoItem label={t("detail.player")} value={()=>shortStr(info()?.player||"..",6)}/>
        </section>
        <Show when={info()?.note}>
          <div className="divider"></div>
          <section  className="modal-content p-1">
            {info()?.note}
          </section>
        </Show>
        
        <div className="divider"></div>
        <div className="modal-action flex items-center justify-between">
          <div>
            <a href={`${app.ao_link_url}/#/message/${info()?.id}?tab=linked`} target="_blank" className="inline-flex items-center">{shortStr(info()?.id||"",6)}<Icon icon="ei:external-link"></Icon></a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm inline-flex items-center gap-2">
              <span className="text-current/50">{t("detail.share")}</span>
              <Alclogo/>
            </span>
            
            <button 
              className="btn btn-square rounded-full"
              onClick={()=>{
                setShareData({
                  title: `Bet $${toBalanceValue(info()?.amount,6,1)} on #Aolotto #R${info()?.round}, do I deserve an #AolottoLuckyClover? @aolotto_dao 🍀🔥`,
                  url: "https://aolotto.com",
                })
                share(TWITTER)
              }}
            >
              <Icon icon="iconoir:share-android"></Icon>
            </button>

          </div>
         
          {/* <form method="dialog">
            <button className="btn">Close</button>
          </form> */}
        </div>
      </div>
    </dialog>
  )
}