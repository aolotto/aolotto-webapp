import { Table, Head, Body, Row, Cell, Col, Cols, Caption, Actions } from '../../compontents/table';
import { createPagination } from '../../lib/pagination';
import { useApp } from '../../contexts';
import { storeResource } from '../../store';
import { fetchAltMintings,fetchAltStakings } from '../../api';
import { createEffect, Suspense } from 'solid-js';
import { t, setDictionarys } from '../../i18n';
import { Icon } from '@iconify-icon/solid';
import Skeleton from '../../compontents/skeleton';
import Spinner from '../../compontents/spinner';
import { shortStr,toBalanceValue } from '../../lib/tools';
import Avatar from '../../compontents/avatar';
import Loadmore from '../../compontents/loadmore';
import { Datetime } from '../../compontents/moment';
export default function Stakings(props) {
  const { info, agentStats } = useApp()
  const [stakings,{loadMore,loadingMore,hasMore}] = storeResource("alt_stakings",()=>createPagination(
    ()=>({stake_id : info?.stake_process, agent_id : info?.agent_process, alt_id : info?.alt_process}),
    fetchAltStakings,
    {size: 100}
  ))
  setDictionarys("en",{ 
    "m.desc": (v)=> <span>A total of <span class="text-base-content">{v?.amount||"..."} </span>${v.ticker} is locked </span>,
    "m.item_desc": (v)=> <span class="text-current/50">Minted <span class="text-base-content">{v?.amount||"..."} </span>$ALT with tax {v?.tax||"0"}</span>,
    "m.user" : "User",
    "m.amount" : "Amount",
    "m.time" : "Time",
    "m.duration" : "Locked Days",
    "m.days" : "Days",
    
  })
  setDictionarys("zh",{
    "m.desc": (v)=> <span>共<span class="text-base-content">{v?.amount||"..."} </span>$ALT 已锁定</span>,
    "m.item_desc": (v)=> <span class="text-current/50">鑄造 <span class="text-base-content">{v?.amount||"..."} </span>$ALT 纳税 {v?.tax||"0"}</span>,
    "m.user" : "用户",
    "m.amount" : "数量",
    "m.time" : "时间",
    "m.duration" : "锁仓时长",
    "m.days" : "天",
  })

  return(
  <>
    <Table class="w-full">
    <Caption>
    {t("m.desc",{
      link:"https://aolotto.org",
      text:"AolottoFoundation",
      ticker:  "ALT",
      amount: agentStats.state == "ready" ? toBalanceValue(agentStats()?.total_staked_amount,12) : 0,
    })}
    </Caption>
    <Head>
      <Cols>
        <Col class="text-left">{t("m.user")}</Col>
        <Col class="text-left">{t("m.amount")}</Col>
        <Col class="text-left ">{t("m.duration")}</Col>
        <Col class="text-right hidden md:table-cell">{t("m.time")}</Col>
        <Col class="text-center w-[1em]">-</Col>
      </Cols>
    </Head>
    <Body>
      {stakings()?.map((item,index)=>(
        <Row key={index}>
          <Cell>
            <div class="flex items-center gap-4 col-span-full lg:col-span-4">
              <Avatar username={item.address} class="size-7"/>
              <div className=' hidden md:block'><span class="text-current/50">{shortStr(item.address||"",8)}</span></div>
            </div>
          </Cell>
          <Cell >{toBalanceValue(item?.quantity,12)} $ALT</Cell>
          <Cell >{item?.duration / (24 * 60 * 60 * 1000)} {t("m.days")}</Cell>
          <Cell class="text-right hidden md:table-cell">
          <span class="text-current/50 "><Datetime ts={(item?.timestamp||0)*1000}/></span>
          </Cell>
          <Cell class="text-center">
            <a href={info.ao_link_url + `/${item?.id}`} target="_blank" class=" btn btn-ghost btn-square btn-link">
              <Icon icon="ei:external-link" />
            </a>
          </Cell>
        </Row>
      ))}
    </Body>
  </Table>
    <Actions className=" ">
          <Show when={hasMore()}>
            <Loadmore loadMore={loadMore} loading={loadingMore()} />
          </Show> 
        </Actions>

  </>
  )
}