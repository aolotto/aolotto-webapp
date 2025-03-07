import { createMemo, createSignal, Match, onMount, Switch } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { toBalanceValue } from "../lib/tool"
import { t,setDictionarys} from "../i18n"
export default props => {
  let _prize_detail
  const [info,setInfo] = createSignal()
  const hits = createMemo(()=>info()?.bet?.[1]>= info()?.wager_limit)
  const pie_rate = createMemo(()=>hits()?0:Math.max(1-info()?.bet?.[1]/info()?.wager_limit,0.01))
  const pie_amount = createMemo(()=>info()?.jackpot * pie_rate())
  const remain_rate = createMemo(()=>hits()?1:Math.min(info()?.bet?.[1]/info()?.wager_limit,0.99))
  const remain_amount = createMemo(()=>info()?.jackpot * remain_rate())
  const jackpot = createMemo(()=>info()?.jackpot)
  
  setDictionarys("en",{
    "l.last_bettor_incentive" : "Last Bettor Incentive",
    "l.winner_jackpot" : "Winner’s Jackpot",
    "p.a" : (v) => <span>The wager hasn’t reached the target of <b className="font-bold">${v}</b>, If the draw is triggered, the jackpot splits:</span>,
    "p.b" : (v) => <span><b className="font-bold">{v.rate}%</b> (~${v.amount}) will go to the final participant.</span>,
    "p.c" : (v) => <span><b className="font-bold">{v.rate}%</b> (~${v.amount}) will be shared by matching bets or awarded to the final bettor if no match occurs.</span>,
    "p.d" : (v) => <span>The wager has reached the target of <b className="font-bold">${v.wager}</b>, and the draw will be triggered soon. <b className="font-bold">The Last Bettor Incentive <sup>[1]</sup></b> is 0%, while the <b className="font-bold">Winner’s Jackpot<sup>[2]</sup></b> is 100% (<b className="font-bold">~${v.jackpot}</b>).</span>,
    "learn_more" : "Learn More",
    "q.q1" : "Jackpot × MAX(1 - Wager / Target, 0.01) × I(Wager < Target)",
    "q.q2" : "Jackpot × (MIN(Wager / Target, 0.99) × I(Wager < Target) + I(Wager ≥ Target))"
  })
  setDictionarys("zh",{
    "l.last_bettor_incentive" : "最后下注者激励",
    "l.winner_jackpot" : "赢家奖金",
    "p.a" : (v) => <span>投注总量暂未达成目标值<b className="font-bold">${v}</b>,如果在此情况下触发开奖, 大奖将会被拆为两部分：</span>,
    "p.b" : (v) => <span><b className="font-bold">{v.rate}%</b> (~${v.amount}) 奖励最后下注者</span>,
    "p.c" : (v) => <span><b className="font-bold">{v.rate}%</b> (~${v.amount}) 分发给中奖者(投注匹配者或无匹配投注时的最后下注人)</span>,
    "p.d" : (v) => <span>投注目标<b className="font-bold">${v.wager}</b>已达成, 很快将会开奖. <b className="font-bold">最后下注者激励 <sup>[1]</sup></b>降低为 0%,<b className="font-bold">赢家奖金<sup>[2]</sup></b>上升为 100% (<b className="font-bold">~${v.jackpot}</b>).</span>,
    "learn_more" : "了解更多",
    "q.q1" : "大奖 × MAX(1 - 投注量 / 投注目标, 0.01) × I(投注量 < 投注目标)",
    "q.q2" : "大奖 × (MIN(投注量 / 投注目标, 0.99) × I(投注量 < 投注目标) + I(投注量 ≥ 投注目标))"
  })
  onMount(()=>{
    props.ref({
      open:(info)=>{
        setInfo(info)
        _prize_detail.showModal()
      }
    })
  })
  return(
    <dialog id="prize_detail" className="modal rounded-2xl " ref={_prize_detail}>
      <div className="modal-box max-w-[480px]">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2">
            <Icon icon="iconoir:xmark" />
          </button>
        </form>
        <h3 className="font-bold text-lg">🍕 Jackpot Pie</h3>
        <div className="py-8 flex justify-between items-center">
          
            <figure className="flex place-content-center flex-wrap w-[32%]">
              <div
                className=" flex-1 aspect-square rounded-full flex items-center justify-center"
                style={{background: `conic-gradient(var(--color-accent) 0% ${pie_rate()*100}%, var(--color-primary) ${pie_rate()*100}% 100%)`}}
              >
                <div className="tooltip" data-tip="hello">
                <div className="tooltip-content">
                  <div className="animate-bounce text-orange-400 -rotate-6 text-2xl font-black">Jackpot!</div>
                </div>
                  <b className="text-sm text-[#fff] font-bold shadow-accent-content">${toBalanceValue(jackpot()||0,6,2)}</b>
                </div>
                
              </div>
            </figure>
            <div className=" w-[50%] flex flex-col h-full gap-4 justify-center">
                <dl>
                  <dt className="text-xs uppercase flex items-center gap-2 pb-2">
                    <span className="size-[1em] inline-block rounded-full bg-accent"></span>
                    <span className="text-current/50">{t("l.last_bettor_incentive")}</span>
                  </dt>
                  <dd><b className="font-bold">${toBalanceValue(pie_amount()||0,6,2)}</b> ({(pie_rate()*100)?.toFixed(2)}%)</dd>
                </dl>
                <dl>
                <dt className="text-xs uppercase flex items-center gap-2 pb-2">
                    <span className="size-[1em] inline-block rounded-full bg-primary"></span>
                    <span className="text-current/50">{t("l.winner_jackpot")}</span>
                  </dt>
                  <dd><b className="font-bold">${toBalanceValue(remain_amount()||0,6,2)}</b> ({(remain_rate()*100)?.toFixed(2)}%)</dd>
                </dl>
              </div>

        </div>
        <Switch fallback="loading...">
          <Match when={hits()}>
          <div className="text-sm">
              <p>{t("p.d",{wager:toBalanceValue(info()?.wager_limit||0,6,2),jackpot:toBalanceValue(jackpot()||0,6,2)})}</p>
            </div>
          </Match>
          <Match when={!hits()}>
            <div className="text-sm">
              <p>{t("p.a",toBalanceValue(info()?.wager_limit||0,6,2))}</p>
              <ul className="list-disc pl-[1.2em] mt-[1em] flex flex-col gap-2">
                <li><b>{t("l.last_bettor_incentive")}<sup>[1]</sup>:</b> {t("p.b",{rate: (pie_rate()*100)?.toFixed(2),amount:toBalanceValue(pie_amount()||0,6,2)})}</li>
                <li><b>{t("l.winner_jackpot")}<sup>[2]</sup>:</b> {t("p.c",{rate: (remain_rate()*100)?.toFixed(2),amount:toBalanceValue(remain_amount()||0,6,2)})}</li>
              </ul>
            </div>
          </Match>
        </Switch>
        
        <div className="text-xs border-t border-current/20 mt-4 pt-4 text-current/50">
          <ul>
            <li>[1] {t("q.q1")}</li>
            <li>[2] {t("q.q2")}</li>
          </ul>
        </div>
        <div className="text-right mt-4">
            <a className="inline-flex items-center" href="https://x.com/aolotto_dao/status/1889315741624865117" target="_blank">{t("learn_more")} <Icon icon="ei:external-link"></Icon></a>
          </div>
      </div>
    </dialog>
  )
}