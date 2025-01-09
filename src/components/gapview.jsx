// components
import { Modal, ModalHeader, ModalContainer, ModalFooter } from "./popup"
import { createEffect, createResource, createSignal, onMount, Show, Suspense } from "solid-js"
import { setDictionarys,t } from "../i18n"
import { InfoItem } from "./infoitem"
import { fetchGapRewardsByBet } from "../api/pool"
import { protocols } from "../signals/global"
import { toBalanceValue } from "../lib/tool"
import { Moment,Datetime } from "./moment"
import { Icon } from "@iconify-icon/solid"
import { app } from "../signals/global"
import { tippy } from "solid-tippy"


export default props => {
  let _gap
  const agent_i = protocols?.details?.[protocols?.agent_id]
  setDictionarys("en",{
    "gap.title" : "Gap Rewards"
  })
  setDictionarys("zh",{
    "gap.title" : "空当奖励"
  })
  const [id,setId] = createSignal()
  const [player,setPlayer] = createSignal()
  const [gaps] = createResource(()=>({pool_id:protocols?.pool_id,agent_id:protocols?.agent_id,bet_id: id()}),fetchGapRewardsByBet)
  onMount(()=>{
      props.ref({
        open:({id,player})=>{
          if(id){setId(id)}
          if(player){setPlayer(player)}
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
      <ModalHeader title="Gap Rewards"></ModalHeader>
      <ModalContainer class="w-full">
        <div class=" m-[1em] flex flex-col gap-2 ">
          <div class="flex">
            <div class="text-sm">2 Gap-Rewards for the bet 0xdfdf....dfdd, total of $234.00, have been awarded to the bettor 0xdfdf.df455.</div>
          </div>
          <div class="border-y border-current/20 gap-1 p-2 h-max-[480px] h-fit overflow-y-scroll">
            <Show when={gaps?.state=="ready"} fallback="loading..">
            <For each={gaps()} fallback={<div>loading...</div>}>
              {(item, index) => (
                <li class="flex justify-between text-sm">
                  <span class="w-[4em]">+ {gaps()?.length - index() }</span>
                  <span class="w-[36%] flex items-center gap-2">
                    <span class="text-current/50"><Datetime ts={Number(item?.time)} class="text-sm"/> </span>
                    
                  </span>
                  <span class="flex-1 text-current/50 justify-end flex items-center gap-2">
                    <span>
                      <span class="text-base-content" use:tippy={{
                       allowHTML: true,
                       hidden: true,
                       animation: 'fade',
                       props: {
                         content : ()=><div class="tipy">
                          {toBalanceValue(item?.total,agent_i?.Denomination||12,agent_i?.Denomination||12)}
                         </div> 
                       }
                     }}>{toBalanceValue(item?.total,agent_i?.Denomination||12,3)}</span> $ALT
                    </span>
                    <a href={`${app?.ao_link_url}/#/message/${item?.id}`} target="_blank"><Icon icon="ei:external-link"></Icon></a>
                  </span>
                </li>
              )}
            </For>

            </Show>
            
            
          </div>
          <div>{player()}</div>

        </div>
        
      </ModalContainer> 
    </Modal>
  )
}