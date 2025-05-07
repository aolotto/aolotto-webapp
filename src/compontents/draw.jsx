import Modal from "./modal";
import { onMount,createSignal,For, createMemo, from, createResource, createEffect } from "solid-js";
import { InfoItem } from "./infoitem";
import Avatar from "./avatar";
import { Icon } from "@iconify-icon/solid";
import { useApp } from "../contexts";
import { shortStr, toBalanceValue } from "../lib/tools";
import { Datetime } from "./moment";
import { t, setDictionarys } from "../i18n"
import { fetchDrawsDetail } from "../api";
import Spinner from "./spinner";

export default function Draw(props) {
  let _draw
  const {info} = useApp()
  const [details, setDetails] = createSignal()
  const [data] = createResource(()=>details()?.id,fetchDrawsDetail)
  onMount(() => {
    props?.ref({
      open:(details)=>{
        console.log(details)
        setDetails(details)
        _draw.open()
      },
      close:()=>{
        _draw.close()
      },
    })
  })
  setDictionarys("en",{
    "draw.title" : "Draw Result",
    "draw.winners" : (v) => <><span className=" text-bold">{v}</span> Winners</>,
    "draw.round" : (v) => <>Round <span className=" font-bold">{v}</span></>,
    "draw.prize" : "Prize",
    "draw.draw_time" : "Draw Time",
    "draw.draw_id" : "Draw ID",
    "draw.draw_height" : "Draw Height"
  })
  setDictionarys("zh",{
    "draw.title" : "开奖结果",
    "draw.winners" : (v) => <><span className=" font-bold">{v}</span> 人获胜</>,
    "draw.round" : (v) => <>轮次 <span className=" font-bold">{v}</span></>,
    "draw.prize" : "奖金",
    "draw.draw_time" : "开奖时间",
    "draw.draw_id" : "开奖ID",
     "draw.draw_height" : "开奖区块"
  })
  createEffect(()=>console.log(data()))
  return (
    <Modal title={t("draw.title")} ref={_draw} id="draw" >
      <div className="px-4 pt-2">
        <div className="w-full flex items-center justify-between py-3 px-2 border-y border-base-300">
          <div className="  flex items-center gap-2 ">
            <Show when={details()}>
              <span className=" inline-block px-[0.8em] py-[0.4em] border rounded-full font-bold">R{details()?.round}</span>
              {/* <span>{t("draw.round",details()?.round)}</span> */}
              <span>{t("draw.winners",details()?.winners)}</span>
            </Show>
          </div>
          <div className="py-2 flex gap-2 items-center justify-center">
            <For each={details()?.lucky_number?.split('')||["*","*","*"]}>
              {(num)=><span class="ball ball-fill size-10 text-2xl">{num}</span>}
            </For>
          </div>
        </div>
        <div className="px-2 py-4 border-b border-base-300 ">
          <Show when={details()} fallback="...">
            {/* <div className="text-lg font-bold">{t("draw.winners",details()?.winners)}</div> */}
            <ul className="flex flex-col gap-1 ">
              <Show when={data.state == "ready"} fallback={<Spinner>fetching winners</Spinner>}>
              <For each={Object.entries(data()?.rewards)}>
                {([k,v])=>
                  <li className="flex items-center justify-between  text-sm">
                    <div className="flex items-center gap-2">
                      <Icon icon="ph:arrow-elbow-down-right-light" className="text-current/50 scale-90"/>
                      <Avatar username={k} className="size-6"/>
                      <p className="text-sm">{shortStr(k,6)}</p>
                    </div>
                    <p className="text-sm">${toBalanceValue(v,6)}</p>
                  </li>
                }
              </For>
              </Show>
            </ul>
          </Show>
        </div>
        <div className="w-full py-4 px-2">
          <InfoItem label={t("draw.prize")}>${toBalanceValue(details()?.jackpot,6)}</InfoItem>
          <InfoItem label={t("draw.draw_time")}>{()=>details()?.created&&<Datetime ts={Number(details()?.created)}/>}</InfoItem>
          <InfoItem label={t("draw.draw_height")}>{()=>details()?.block_height}</InfoItem>
          <InfoItem label={t("draw.draw_id")}><a href={info?.ao_link_url + `/#/message/${details()?.id}`} className=" inline-flex gap-2 items-center" target="_blank">{shortStr(details()?.id,8)}<Icon icon="ei:external-link"/></a></InfoItem>
        </div>
      </div>
    </Modal>
  );
}