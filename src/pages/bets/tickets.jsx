import { createStore } from "solid-js/store"
import { For,createRoot,Suspense, onMount,useTransition, createEffect, splitProps, createMemo, Switch, Match, ErrorBoundary } from "solid-js"
import Avatar from "../../compontents/avatar"
import { Icon } from "@iconify-icon/solid"
import { Table,Caption,Head,Cols,Col,Body,Row,Cell,Actions } from "../../compontents/table"
import Loadmore from "../../compontents/loadmore"
import { createPagination } from "../../lib/pagination"
import { useApp } from "../../contexts"
import { fetchActiveBets } from "../../api"
import { shortStr,toBalanceValue } from "../../lib/tools"
import { Moment } from "../../compontents/moment"
import Spinner from "../../compontents/spinner"
import { storeResource } from "../../store"
import { t,setDictionarys } from "../../i18n"
import Ticket from "../../compontents/betdetail"
import Pie from "../../compontents/pie"
export default props => {
  let _ticket
  let _pie
  setDictionarys("en",{
    "t.win_rate" : "The last bettor has a higher chance to win since they get 100% of the jackpot if no bets match.",
    "t.no_bets" : "No bets yet, earlier bets mint more.",
    "t.win_rate2" : (v)=><span>If no more bets, {v.last_bettor_rate}% <b>(🍕~${v.last_bettor_amount})</b> of the jackpot goes to the last bettor, {v.winner_rate}% to the winners.</span>,
    "details" : "details",
    "tooltip.gap_reward": (v)=><span>Since no new bets were placed after this bet for a while, the protocol distributed <b>{v.count}</b> Gap-Rewards to the bettor (one every 10 minutes), totaling <b>{v.amount}</b> $ALT.</span>,
    "tooltip.first_gap_reward": (v)=><span>The {v.count>1?"next":"first"} Gap-Reward is expected to be received at {v.time} if no new bets are added in time. After the time, refresh the list to check!</span>,
    "th.player" : "Player",
    "th.number" : "Number",
    "th.date" : "Date",
    "i.new_tickets" : (v) => <span>{v} new tickets</span>
  })
  setDictionarys("zh",{
    "t.win_rate" : "最後下注的赢率更大，开奖若无中奖投注的情况下，奖金100%由最后下注者一人所得。",
    "t.no_bets" : "暫無投注,越早投注鑄幣奖励越高.",
    "t.win_rate2" : (v)=><span>若无投注追加, 大奖的{v.last_bettor_rate}% <b>(🍕~${v.last_bettor_amount})</b> 奖励最后下注者, {v.winner_rate}% 为赢家所得.</span>,
    "tooltip.gap_reward": (v)=><span>这笔投注之后的一段时间内无新投注追加，协议向投注者下发了<b>{v.count}</b>次空当奖励(Gap-Reward)，共计<b>{v.amount}</b>$ALT.</span>,
    "tooltip.first_gap_reward": (v)=><span>如果没有新的投注追加,{v.count>1?"下一笔":"第一笔"}空当奖励（Gap-Reward）将于{v.time}下发，超出时间后建议刷新列表检查。</span>,
    "details" : "详情",
    "th.player" : "玩家",
    "th.number" : "号码",
    "th.date" : "日期",
    "i.new_tickets" : (v) => <span>{v}笔新投注</span>
  })
  const [isPending, start] = useTransition();
  const { info } = useApp()
  const [tickets,{refetch,hasMore,loadingMore,loadMore},{size,page}] = storeResource("tickets",()=>createPagination(()=>info.pool_process,fetchActiveBets,{size:100}))
  const [{pool,update},others] = splitProps(props,["pool","update"])
  const reached_target = createMemo(()=>{
    if(pool.state == "ready"){
      return pool()?.bet?.[1]>=pool()?.wager_limit
    }
  })
  const lastreward = createMemo(()=>{
    if(pool.state == "ready"){
      return pool()?.jackpot * (1-pool()?.bet?.[1]/pool()?.wager_limit)
    }
  })
  const lastreward_rate = createMemo(()=>{
    if(pool.state == "ready"){
      return (Math.max(1-pool()?.bet?.[1]/pool()?.wager_limit,0.01)*100).toFixed(2)
    }
  })
  const winreward_rate = createMemo(()=>{
    if(pool.state == "ready"){
      return ((pool()?.bet?.[1]/pool()?.wager_limit)*100).toFixed(2)
    }
  })
  onMount(()=>{
    if(props.ref){
      props?.ref({
        refetch: ()=>{
          if(tickets.state == "ready"){
            start(refetch)
          }
        }
      })
    }
  })

  createEffect(()=>console.log(tickets.state))
  return(
    <ErrorBoundary fallback={(err,reset)=><div role="alert" className="alert alert-error alert-soft">
      <span>{err.message}</span>
    </div>}>
    <Suspense fallback={<Spinner className="w-full py-20"/>}>
    <section 
      className="w-full"
      classList = {{
        "opacity-50" : isPending()
      }}
    >  
      <Table>
        <Caption>
        <div class="w-full flex flex-col md:flex-row justify-center items-center pt-4 text-sm gap-2">
          <Switch>
            <Match when={update()}><div class="w-full flex justify-center items-center h-10 pb-4 text-sm">
              <button 
                className="btn btn-sm rounded-full"
                onClick={()=>{
                  if(tickets.state == "ready"){
                    start(refetch)
                  }
                  if(others?.onClickUpdate){
                    others.onClickUpdate()
                  }
                }}
              >
                <div className="inline-grid *:[grid-area:1/1]">
                  <div className="status status-accent animate-ping"></div>
                  <div className="status status-accent"></div>
                </div>
                {t("i.new_tickets",update())}
              </button>
              </div>
            </Match>
            <Match when={!update()}>
              <span className=" animate-bounce inline-flex items-center justify-center">👇</span> 
              <Show when={!reached_target()} fallback={
                <span>
                  {t("t.win_rate")}
                </span>}>
                <span>
                {t("t.win_rate2",{
                  last_bettor_rate: lastreward_rate(),
                  last_bettor_amount: toBalanceValue(lastreward()||0,6),
                  winner_rate: winreward_rate()
                })}
                </span>
              </Show>
              <button className="btn btn-link p-0" onClick={()=>_pie?.open(pool())}>{t("details")}</button>
            </Match>
          </Switch>
          
        </div>
        </Caption>
        <Head>
          <Cols>
            <Col className="text-left p-2 w-8 md:w-[20%]">{t("th.player")}</Col>
            <Col className="text-left p-2">bet2mint</Col>
            <Col className="text-right p-2">Gap-Reward</Col>
            <Col className="hidden md:table-cell text-right p-2 w-10 md:w-[18%]">{t("th.date")}</Col>
            <Col className="p-2 w-8 text-center">-</Col>
          </Cols>
        </Head>
        <Body>
          <For each={tickets()} fallback="empty">
            {(item,index) => (
              <Row>
                <Cell className="">
                  <div className="flex items-center gap-2">
                    <Avatar username={item?.player} className="size-7"/> <span className=" text-current/50 hidden md:inline-block">{shortStr(item?.player,6)}</span>
                  </div>
                </Cell>
                <Cell className="">
                  <span><b>${toBalanceValue(item?.amount,item?.denomination||6)}</b> <span className="text-current/50">→</span> <div className="tooltip inline-block" data-tip={toBalanceValue(item.mint.total,item.mint.denomination||12,12)}>{toBalanceValue(item.mint.total,item.mint.denomination||12)} </div> <span className="text-current/50">$ALT</span></span>
                  <dl className="text-xs md:hidden text-current/50">
                    <dt className=" sr-only">date</dt>
                    <dd><Moment ts={item.created}/></dd>
                  </dl>
                </Cell>
                  <Cell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Show when={index() == 0}>
                        <div class="lg:tooltip">
                          <div class="tooltip-content hidden md:block">
                            <p class="text-left p-2">
                              {t("tooltip.first_gap_reward",
                                { time: new Date(item?.created + (600000 * (item?.mint?.plus?.[1] || 1))).toLocaleTimeString(), count: item?.mint?.plus?.[1] ? (item?.mint?.plus?.[1]) : 1 }
                              )}
                            </p>
                          </div>
                          <Icon icon="eos-icons:hourglass" />
                        </div>
                      </Show>
                      <Show when={item?.mint?.plus}>
                        <div
                          class="  text-xs md:text-sm px-2 py-1 rounded-full cursor-pointer lg:tooltip"
                        >
                          <div class="tooltip-content hidden md:block">
                            <p class="text-left p-2">{t("tooltip.gap_reward", { count: item?.mint?.plus?.[1], amount: toBalanceValue(item?.mint?.plus?.[0], item?.mint?.denomination || 12, 12) })}</p>
                          </div>
                          +{toBalanceValue(item?.mint?.plus?.[0], item?.mint?.denomination || 12)} <span className="text-current/50">$ALT</span>
                        </div>
                      </Show>
                    </div>
                  </Cell>
                <Cell className=" hidden md:table-cell text-right"><span className="text-current/50"><Moment ts={item.created}/></span></Cell>
                <Cell className=" size-6 md:size-8 text-center">
                  <button 
                    className="btn btn-circle btn-sm lg:btn-md btn-ghost text-primary"
                    onClick={()=>_ticket.open(item)}
                  >
                    <Icon icon="hugeicons:square-arrow-expand-01" />
                  </button>
                </Cell>
            </Row>
            )}
          </For>
        </Body>
      </Table>
      {/* <Actions>

      </Actions> */}
      <Actions className=" ">
        <Show when={hasMore()}>
          <Loadmore loadMore={loadMore} loading={loadingMore()||isPending()} />
        </Show> 
      </Actions>
    </section>
    <Ticket ref={_ticket}/>
    <Pie ref={_pie}/>
    </Suspense>
    </ErrorBoundary>
  )
}