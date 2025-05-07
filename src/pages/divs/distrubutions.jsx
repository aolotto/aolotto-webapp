import { Table, Body, Head, Row, Cell, Cols, Col, Caption, Actions } from "../../compontents/table"
import { createEffect, For, Suspense,createResource } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import Loadmore from "../../compontents/loadmore"
import { storeResource } from "../../store"
import { createPagination } from "../../lib/pagination"
import { fetchDividends } from "../../api"
import { useApp } from "../../contexts"
import Spinner from "../../compontents/spinner"
import { Datetime } from "../../compontents/moment"
import { shortStr,toBalanceValue } from "../../lib/tools"
import { t,setDictionarys } from "../../i18n"
import Skeleton from "../../compontents/skeleton"
import { fetchState } from "../../api"

export default props => {
  setDictionarys("en",{
    "l.next_distribution" : "Next distribution",
    "l.no" : "No",
    "l.amount" : "Amount",
    "l.addresses" : "Addresses",
    "l.details" : "Details",
    "l.date" : "Date",
  })
  setDictionarys("zh",{
    "l.next_distribution" : "下次分红",
    "l.no" : "编号",
    "l.amount" : "金额",
    "l.addresses" : "地址",
    "l.details" : "详情",
    "l.date" : "日期",
  })
  const {info} = useApp()
  
  const [pool]  = storeResource("pool_state",()=>createResource(()=>info?.pool_process,fetchState))
  const [divs,{loadMore,hasMore,loadingMore}] = storeResource("dividends",()=>createPagination(()=>({pool_id:info?.pool_process,agent_id:info?.agent_process}),fetchDividends,{size:100}))
 
  return (
    <Suspense fallback={<Spinner className="py-10 w-full"/>}>
    <div>
      <Table>
        <Caption>
        <div class="w-full text-center text-current/50"> {t("l.next_distribution")} : <span><Show when={pool.state == "ready"} fallback={<Skeleton w={10} h={1}/>}>{new Date(pool()?.ts_next_dividend).toLocaleString()}</Show></span></div>
        </Caption>
        <Head>
          <Cols>
            <Col>{t("l.no")}</Col>
            <Col className=" hidden md:table-cell">{t("l.date")}</Col>
            <Col className="p-2">{t("l.amount")}</Col>
            <Col className=" hidden md:table-cell">{t("l.addressed")}</Col>
            <Col className="text-right">{t("l.details")}</Col>
          </Cols>
        </Head>
        <Body>
          <For each={divs()}>
            {item => (
              <Row>
                <Cell>{item?.ref}</Cell>
                <Cell className=" hidden md:table-cell"><Datetime ts={item?.checkpoint ? Number(item?.checkpoint) : item.timestamp * 1000}/></Cell>
                <Cell className="p-2">
                  <div className=" flex flex-col gap-2">
                    <div className="font-bold">${toBalanceValue(item?.amount || 0, 6)}</div>
                    <div className=" inline-flex md:hidden items-center divide-x divide-base-300 text-xs text-current/50">
                      <span className=" inline-flex items-center pr-2 gap-2"><Icon icon="iconoir:profile-circle" className="text-[1em]" /> {item?.addresses}</span>
                      <span className=" inline-flex items-center pl-2 gap-2"><Datetime ts={item?.checkpoint ? Number(item?.checkpoint) : item.timestamp * 1000}/></span>
                    </div>
                  </div>
                </Cell>
                <Cell className=" hidden md:table-cell">{item?.addresses}</Cell>
                <Cell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-current/50 hidden md:inline-flex">{shortStr(item.id)}</span>
                    <a href={`https://www.ao.link/#/message/${item.id}`} target="_blank"><Icon icon="ei:external-link" /></a>
                  </div>
                </Cell>
              </Row>
            )}
          </For>
        </Body>
            
      </Table>

      <Actions className=" ">
        <Show when={hasMore()}>
          <Loadmore loadMore={loadMore} loading={loadingMore()} />
        </Show> 
      </Actions>
    </div>
    </Suspense>
  )
}