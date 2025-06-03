
import { storeResource } from "../../store"
import { createEffect, For, Suspense } from "solid-js"
import { fetchDraws } from "../../api"
import { useApp } from "../../contexts"
import { createPagination } from "../../lib/pagination"
import Spinner from "../../compontents/spinner"
import { Table,Body,Head,Cols,Col,Row,Cell } from "../../compontents/table"
import { toBalanceValue } from "../../lib/tools"
import { Icon } from "@iconify-icon/solid"
import Draw from "../../compontents/draw"
import { t, setDictionarys } from "../../i18n"
import Skeleton from "../../compontents/skeleton"


export default function Draws() {
  let _draw_detail
  setDictionarys("en",{
    "draws.title":"Draw Results",
    "draws.total":"Total of {{ total }} draws rewarded {{ total_reward }}",
    "draws.round":"Round",
    "draws.prize":"Prize",
    "draws.winners":"Winners",
    "draws.draw_time":"Draw Time",
    "draws.lucky_number":"Lucky Number",
  })
  setDictionarys("zh",{
    "draws.title":"开奖记录",
    "draws.total":"共 {{ total }} 轮开奖并发放奖金 {{ total_reward }}",
    "draws.round":"轮次",
    "draws.prize":"奖金",
    "draws.winners":"中奖人数",
    "draws.draw_time":"开奖时间",
    "draws.lucky_number":"幸运号码",
  })
  const { info, agentStats } = useApp()
  const [ draws,{hasMore,loadingMore,loadMore}] = storeResource(
    "draws", 
    ()=>createPagination(
      ()=>({
        pool_id : info.pool_process,
        agent_id : info.agent_process,
        alt_id : info.alt_process,
      }),
      fetchDraws,
      {size: 100}
    )
  )

  // createEffect(()=>console.log(agentStats()))
  return(
    <main className="container py-8 md:py-10">
      <Suspense fallback={<Spinner className="w-full py-10"/>}>
      <div className=" w-full py-10 flex flex-col justify-between items-center gap-2">
        <h1 className="text-4xl md:text-6xl lg:text-7xl uppercase font-bold">{t("draws.title")}</h1>
        <Show when={agentStats.state == "ready"} fallback={<Skeleton w={10} h={1}/>}>
          <p className="text-current/50">{t("draws.total",{total: agentStats()?.total_archived_round , total_reward: "$"+toBalanceValue(agentStats()?.total_reward_amount,6)})}</p>
        </Show>
        
      </div>
      <div>
        <Table className="w-full">
          <Head>
            <Cols>
              <Col>{t("draws.round")}</Col>
              <Col className="hidden md:table-cell">{t("draws.prize")}</Col>
              <Col className="hidden md:table-cell">{t("draws.winners")}</Col>
              <Col>{t("draws.draw_time")}</Col>
              <Col className="text-right">{t("draws.lucky_number")}</Col>
              <Col className="text-center">-</Col>
            </Cols>
          </Head>
          <Body>
            <For each={draws()}>
              {(item)=>{
                const {id,round,timestamp,height,lucky_number,jackpot,denomination, winners,created} = item
                return (
                  <Row key={id}>
                    <Cell><span className=" inline-block px-[0.8em] py-[0.3em] rounded-full border">R{round}</span></Cell>
                    <Cell className="hidden md:table-cell"><div class="">${toBalanceValue(jackpot,denomination||6)}</div></Cell>
                    <Cell className="hidden md:table-cell">{winners}</Cell>
                    <Cell>{new Date(Number(created)).toLocaleString()}</Cell>
                    <Cell className="text-right">
                      <div className="py-2 inline-flex gap-1">
                        <For each={lucky_number?.split('')||["*","*","*"]}>
                          {(num)=><span class="ball ball-fill size-9 text-xl">{num}</span>}
                        </For>
                      </div>
                    </Cell>
                    <Cell className=" size-6 md:size-8 text-center">
                      <button 
                        className="btn btn-circle btn-sm lg:btn-md btn-ghost text-primary"
                        onClick={()=>{
                          _draw_detail.open(item)
                        }}
                      >
                        <Icon icon="hugeicons:square-arrow-expand-01" />
                      </button>
                    </Cell>
                  </Row>
                )
              }}
            </For>

          </Body>
        </Table>

        {hasMore() && (
          <div className="flex justify-center">
            <button className="btn btn-primary" onClick={loadMore} disabled={loadingMore()}>
              {loadingMore() ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
      <Draw ref={_draw_detail} />
      </Suspense>
    </main>
  )
}