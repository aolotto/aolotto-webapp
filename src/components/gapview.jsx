// components
import { Modal, ModalHeader, ModalContainer, ModalFooter } from "./popup"
import { createEffect, createMemo, createResource, createSignal, onMount, Show, batch } from "solid-js"
import { setDictionarys,t } from "../i18n"
import { InfoItem } from "./infoitem"
import { fetchGapRewards } from "../api/pool"
import { protocols } from "../data/info"
import { toBalanceValue } from "../lib/tool"
import { Moment,Datetime } from "./moment"
import { Icon } from "@iconify-icon/solid"
import { app } from "../data/info"
import { tippy } from "solid-tippy"
import { shortStr } from "../lib/tool"



export default props => {
  let _gap
  const agent_i = protocols?.details?.[protocols?.agent_id]
  setDictionarys("en",{
    "gap.title" : "⏳ Gap Rewards",
    "gap.based_on" : "Based on Bet",
    "gap.rewarded_to" : "Rewarded To",
    "gap.first_tip" : (v)=> <span>A total of <b class="text-base-content">{v.count}</b> gap-rewards have been distributed, amounting to <b class="text-base-content">{v.amount}</b> $ALT, with more to come if no new bets are placed.</span>,
    "gap.tip" : (v) => <span> total of <b class="text-base-content">{v.count}</b> gap-rewards have been distributed, amounting to <b class="text-base-content">{v.amount}</b> $ALT.</span>
  })
  setDictionarys("zh",{
    "gap.title" : "⏳ 空当奖励",
    "gap.based_on" : "基于投注",
    "gap.rewarded_to" : "奖励給",
    "gap.first_tip" : (v)=> <span>累计已下发 <b class="text-base-content">{v.count}</b> 次空当奖励(gap-rewards) <b class="text-base-content">{v.amount}</b> $ALT, 若无新的投注追加的情况下，还会继续继续消耗奖励余额。</span>,
    "gap.tip" : (v) => <span> 累计下发 <b class="text-base-content">{v.count}</b>次空当奖励(gap-rewards) <b class="text-base-content">{v.amount}</b> $ALT.</span>
  })
  const [id,setId] = createSignal()
  const [player,setPlayer] = createSignal()
  const [mint,setMint] = createSignal()
  const [index,setIndex] = createSignal(0)
  const [gaps,{refetch}] = createResource(()=>protocols?.pool_id,fetchGapRewards)
  const items = createMemo(()=>{
    if(gaps()&&id()){
      return gaps()?.[id()]
    }
  })
  onMount(()=>{
      props.ref({
        open:({id,player,mint,index})=>{
          batch(()=>{
            if(id){setId(id)}
            if(player){setPlayer(player)}
            if(mint){setMint(mint)}
            if(index){setIndex(index())}
          })
          
          _gap.open()
        },
        close:()=>_gap.close(),
      })
    })
  createEffect(()=>console.log("gaps in page",gaps()))
  return (
    <Modal 
      ref={_gap}
      onClose={()=>console.log("13444")}
      mask={true}
      closable={true}
      class="w-full max-w-[480px]"
    >
      <ModalHeader title={t("gap.title")}></ModalHeader>
      <ModalContainer class="w-full">
        <div class=" mx-[1em] flex flex-col border-t border-current/20 mt-[0.5em]">
          <div class="text-sm flex flex-col p-1">
            <InfoItem label={t("gap.based_on")} value={()=>
              <div class="w-full flex items-center justify-between pr-1">
                <span>{shortStr(id()||"...",6)}</span>
                <a href={`${app?.ao_link_url}/#/message/${id()}`} target="_blank"><Icon icon="ei:external-link"/></a>
              </div>
            }/>
            <InfoItem label={t("gap.rewarded_to")} value={()=>
              <div class="w-full flex items-center justify-between pr-1">
                <span>{shortStr(player()||"...",6)}</span>
                <a href={`${app?.ao_link_url}/#/entity/${player()}`} target="_blank"><Icon icon="ei:external-link"/></a>
              </div>
            }/>
          </div>
          <Show when={gaps?.state=="ready"} fallback="loading..">
          <div class=" gap-1 p-2 h-full max-h-48 overflow-scroll border-t border-current/20">
              <For each={items()}>
                {(item, index) => (
                  <li class="flex justify-between text-sm ">
                    <span class="w-[4em]">+ {index()+1 }</span>
                    <span class="w-[36%] flex items-center gap-2">
                      <span class="text-current/50"><Datetime ts={Number(item?.[0])} class="text-sm"/> </span>
                      
                    </span>
                    <span class="flex-1 text-current/50 justify-end flex items-center gap-2">
                      <span>
                        <span class="text-base-content tooltip tooltip-left" 
                        data-tip = {toBalanceValue(item?.[1],agent_i?.Denomination||12,agent_i?.Denomination||12)}
                      >{toBalanceValue(item?.[1],agent_i?.Denomination||12,3)}</span> $ALT
                      </span>
                      <a href={`${app?.ao_link_url}/#/message/${item?.[2]}`} target="_blank"><Icon icon="ei:external-link"></Icon></a>
                    </span>
                  </li>
                )}
              </For>

           
            
            
          </div>
          </Show>
          <div class="text-sm flex pt-4 pb-8 gap-2 border-t border-current/20">
            <div class="w-16 py-2 flex justify-center">{index()==0?<Icon icon="eos-icons:hourglass" />:<span>✅</span>}</div>
            <div class="text-current/50 flex">
              <Show when={index()==0} fallback={<span>{t("gap.tip",{count:mint()?.plus?.[1],amount:()=>toBalanceValue(mint()?.plus?.[0]||0,12,3)})}</span>}>
              {t("gap.first_tip",{count:mint()?.plus?.[1],amount:()=>toBalanceValue(mint()?.plus?.[0]||0,12,3)})}
              </Show>
              
            </div>
          </div>

        </div>
        
      </ModalContainer> 
    </Modal>
  )
}