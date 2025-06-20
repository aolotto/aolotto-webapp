import { createStore } from "solid-js/store"
import { For,createRoot,Suspense, onMount,useTransition, createEffect, splitProps, createMemo, Switch, Match, ErrorBoundary, createSignal, onCleanup } from "solid-js"
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
import Timer from "../../compontents/timer"
export default props => {
  let _ticket
  let _pie
  let _timer
  setDictionarys("en",{
    "t.win_rate" : "The last bettor has a higher chance to win since they get 100% of the jackpot if no bets match.",
    "t.no_bets" : "No bets yet, earlier bets mint more.",
    "t.win_rate2" : (v)=><span>If no more bets, {v.last_bettor_rate}% <b>(🍕~${v.last_bettor_amount})</b> of the jackpot goes to the last bettor, {v.winner_rate}% to the winners.</span>,
    "details" : "details",
    "tooltip.gap_reward": (v)=><span>Since no new bets were placed after this bet for a while, the protocol distributed <b>{v.count}</b> Gap-Rewards to the bettor (one every 10 minutes), totaling <b>{v.amount}</b> $ALT.</span>,
    "tooltip.first_gap_reward": (v)=><span>After placing a bet, a Gap-Reward of {v} $ALT is calculated every 10 minutes based on the bet amount, with each reward decreasing by 0.6% from the previous one. If the gap is less than 10 minutes, no reward is given. If the next bet amount exceeds the current one, 50% of the accumulated Gap-Rewards will be shared with the next bettor.</span>,
    "th.player" : "Player",
    "th.number" : "Number",
    "th.date" : "Date",
    "i.new_tickets" : (v) => <span>{v} new tickets</span>,
    "t.gaprewards" : (v) => <span>{v.amount} $ALT was minted through Gap-Rewards. After a 20% minting tax deduction, the net amount received is {v.net} $ALT.</span>,
    "l.gaptime" : "Gap Time",
    "l.total-rewards" : "Total",
    "l.rewards-per-min" : "Rewards/Min",
    "l.got-looted" : "Split",
    "l.min" : (v) => v>1?`${v} mins`:`${v} min`,
    "l.looted" : "Looted",
    "l.gap-reward" : "Rewards",
    "l.bet2mint" : (v) => <span>A total of {v.amount} $ALT was minted. After a 20% minting tax deduction, the net amount received is {v.net} $ALT.</span>,
    "l.rewards" : "Rewards",
    "l.buff-released" : "Buffed"
  })
  setDictionarys("zh",{
    "t.win_rate" : "最後下注的赢率更大，开奖若无中奖投注的情况下，奖金100%由最后下注者一人所得。",
    "t.no_bets" : "暫無投注,越早投注鑄幣奖励越高.",
    "t.win_rate2" : (v)=><span>若无投注追加, 大奖的{v.last_bettor_rate}% <b>(🍕~${v.last_bettor_amount})</b> 奖励最后下注者, {v.winner_rate}% 为赢家所得.</span>,
    "tooltip.gap_reward": (v)=><span>这笔投注之后的一段时间内无新投注追加，协议向投注者下发了<b>{v.count}</b>次空当奖励(Gap-Reward)，共计<b>{v.amount}</b>$ALT.</span>,
    "tooltip.first_gap_reward": (v)=><span>下注后每10分钟按照投注奖励{v}$ALT统计一次空当奖励，每一笔递减0.6%,不足10分钟奖励额度为0,若下一笔投注金额超过本笔投注,累计的空档奖励将会均分一半给下一笔投注玩家。</span>,
    "details" : "详情",
    "th.player" : "玩家",
    "th.number" : "号码",
    "th.date" : "日期",
    "i.new_tickets" : (v) => <span>{v}笔新投注</span>,
    "t.gaprewards" : (v) => <span>获得Gap-Reawads {v.amount} $ALT,扣除20%铸币税后实得 {v.net} $ALT.</span>,
    "l.gaptime" : "空当时间",
    "l.total-rewards" : "奖励总额",
    "l.rewards-per-min" : "每分钟奖励",
    "l.got-looted" : "被掠夺",
    "l.looted" : "掠夺",
    "l.min" : (v) => `${v} 分钟`,
     "l.gap-reward" : "空当奖励",
     "l.bet2mint" : (v) => <span>累计铸造{v.amount} $ALT,扣除20%铸币税后实得{v.net} $ALT</span>,
     "l.rewards" : "铸币奖励",
     "l.buff-released" : "Buff释放"
  })
  const [isPending, start] = useTransition();
  const { info } = useApp()
  const [tickets,{refetch,hasMore,loadingMore,loadMore},{size,page}] = storeResource("tickets",()=>createPagination(()=>info.pool_process,fetchActiveBets,{size:100}))
  const [{pool,update},others] = splitProps(props,["pool","update"])
  const [gaptime,setGaptime] = createSignal("00:00:00")
  const [gapEst,setGapEst] = createSignal(0)
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
    _timer = setInterval(()=>{
      if(tickets?.state !== "ready"){
        setGaptime(`00:00:00`)
        setGapEst(0)
      }
      else{
        const latest_bet = tickets()?.[0]
        const now = new Date().getTime()
        const diff = (now - latest_bet?.created || now) / 1000
        let day = Math.floor(diff / 60 / 60 / 24).toString().padStart(2, "0");
        let hour = Math.floor(diff / 60 / 60 % 24 ).toString().padStart(2, "0");
        let minute = Math.floor(diff / 60 % 60).toString().padStart(2, "0");
        let second = Math.floor(diff % 60).toString().padStart(2, "0");
        setGaptime(`${hour}:${minute}:${second}`)
        const rounds = Math.floor(diff / 600)
        console.log("rounds",rounds,latest_bet.mint?.unit)
        const unit = latest_bet.mint?.unit || 0;
        const n = rounds;
        const sum = n / 2 * (2 - (n - 1) * 0.0069) * unit;
        const total = Math.max(sum,0);
        setGapEst(toBalanceValue(total,12,12))
      }
    },1000)
  })

  onCleanup(()=>{
    clearInterval(_timer)
  })
  
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
                    <Avatar username={item?.player} className="size-7"/> 
                    <span className=" text-current/50 hidden md:inline-block">{shortStr(item?.player,6)}</span>
                  </div>
                </Cell>
                <Cell className="">
                  <span className="flex items-center gap-2">
                    <b>${toBalanceValue(item?.amount,item?.denomination||6)}</b> 
                    <span className="text-current/50">→</span> 
                    <div className="tooltip inline-block" 
                    >
                      <div class="tooltip-content text-xs">
                        <div className=" flex flex-col items-start justify-center p-2 text-start gap-2 divide-current divide-y">
                          <p className="pb-2">{t("l.bet2mint",{amount:toBalanceValue(item.mint.total,item.mint.denomination||12,12),net:toBalanceValue(item?.mint?.amount,12,12)})}</p>
                          <ul className="">
                            <li className="flex items-center">
                              <span className="w-[6em]">{t("l.rewards")}:</span>
                              <span>{toBalanceValue(item?.mint?.total-item?.mint?.killed,12,12)} $ALT</span>
                            </li>
                            <li className="flex items-center">
                              <span className="w-[6em]">{t("l.buff-released")}:</span>
                              <span>{toBalanceValue(item?.mint?.buff,12,12)} $ALT</span>
                            </li>
                            <li className="flex items-center">
                              <span className="w-[6em]">{t("l.looted")}:</span>
                              <span>{toBalanceValue(item?.mint?.killed,12,12)} $ALT</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {toBalanceValue(item.mint.total,item.mint.denomination||12)} 
                    </div> 
                    <span className="text-current/50">$ALT</span>
                  </span>
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
                            <div className="p-2">
                              <p class=" text-start text-xs border-b pb-2">
                              
                                {/* 下注后每10分钟按照投注奖励{toBalanceValue(item?.mint?.unit,12,12)}$ALT统计一次空当奖励，每一笔递减0.6%,不足10分钟奖励额度为0,若下一笔投注金额超过本笔投注,累计的空档奖励将会均分一半给下一笔投注玩家。 */}

                                {t("tooltip.first_gap_reward",toBalanceValue(item?.mint?.unit,12,12))}
                              </p>
                              <ul className="pt-2 text-start text-xs flex flex-col justify-start">
                                <li className="flex items-center">
                                  <span className="w-[6em]">{t("l.gaptime")}:</span>
                                  <span>{gaptime()}</span>
                                </li>
                                <li className="flex items-center">
                                  <span className="w-[6em]">{t("l.gap-reward")}:</span>
                                  <span>~{gapEst()} $ALT</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{gaptime()}</span>
                            {/* <Timer start={item?.created} class="text-sm text-secondary"/> */}
                            <Icon icon="eos-icons:hourglass" />
                          </div>
                        </div>
                      </Show>
                      <Show when={item?.gap_rewards && Number(item?.gap_rewards) > 0}>
                        <div
                          class="  text-xs md:text-sm px-2 py-1 rounded-full cursor-pointer lg:tooltip"
                        >
                          <div class="tooltip-content hidden md:block">
                            <div class="text-left p-2 text-xs">
                              <p className="border-b pb-2">
                                {t("t.gaprewards",{net:toBalanceValue(item?.gap_rewards * 0.8, item?.mint?.denomination || 12, 12),amount:toBalanceValue(item?.gap_rewards, item?.mint?.denomination || 12, 12)})}
                              </p>
                              <ul className="pt-2">
                                <li className="flex items-center">
                                  <span className="w-[8em] inline-block">{t("l.gaptime")}:</span><span>{t("l.min",Math.round(item?.diff_time / 60000,0))}</span>
                                </li>
                                <li>
                                  <span className="w-[8em] inline-block">{t("l.total-rewards")}:</span><span>{toBalanceValue(item?.bekilled + item?.gap_rewards, item?.mint?.denomination || 12, 12)} $ALT</span>
                                </li>
                                {/* <li>
                                  <span className="w-[8em] inline-block">{t("l.rewards-per-min")}:</span><span>{toBalanceValue((item?.bekilled + item?.gap_rewards) / item?.diff_time * 60000, item?.mint?.denomination || 12, 12)} $ALT</span>
                                </li> */}
                                <li>
                                  <span className="w-[8em] inline-block">{t("l.got-looted")}:</span><span>{toBalanceValue(item?.bekilled, item?.mint?.denomination || 12, 12)} $ALT</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          +{toBalanceValue(item?.gap_rewards, item?.mint?.denomination || 12)} <span className="text-current/50">$ALT</span>
                        </div>
                      </Show>
                    </div>
                  </Cell>
                <Cell className=" hidden md:table-cell text-right"><span className="text-current/50"><Moment ts={item.created}/></span></Cell>
                <Cell className=" size-6 md:size-8 text-center">
                  <button 
                    className="btn btn-circle btn-sm lg:btn-md btn-ghost text-primary"
                    onClick={()=>_ticket.open({...item,isFirst:index()==0})}
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