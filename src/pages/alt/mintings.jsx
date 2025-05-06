import { Table, Head, Body, Row, Cell, Col, Cols, Caption,Actions } from '../../compontents/table';
import { createPagination } from '../../lib/pagination';
import { useApp } from '../../contexts';
import { storeResource } from '../../store';
import { fetchAltMintings } from '../../api';
import { createEffect, Suspense } from 'solid-js';
import { t, setDictionarys } from '../../i18n';
import { Icon } from '@iconify-icon/solid';
import Skeleton from '../../compontents/skeleton';
import Spinner from '../../compontents/spinner';
import { shortStr,toBalanceValue } from '../../lib/tools';
import Avatar from '../../compontents/avatar';
import  Loadmore  from '../../compontents/loadmore';
import { Datetime } from '../../compontents/moment';
export default function Mintings(props) {
  const { info, agentStats } = useApp()
  const [mintings,{loadMore,loadingMore,hasMore}] = storeResource("alt_mintings",()=>createPagination(
    ()=>({pool_id : info?.pool_process, agent_id : info?.agent_process}),
    fetchAltMintings,
    {size: 100}
  ))
  setDictionarys("en",{ 
    "m.desc": (v)=> <span> A total of <span class="text-base-content">{v?.amount||"..."} </span>${v.ticker} was minted.</span>,
    "m.item_desc": (v)=> <span class="text-current/50">Minted <span class="text-base-content">{v?.amount||"..."} </span>$ALT with tax {v?.tax||"0"}</span>,
    "m.user" : "User",
    "m.type" : "Type",
    "m.amount" : "Amount",
    "m.tax" : "Tax",
    "m.time" : "Time",
    
  })
  setDictionarys("zh",{
    "m.desc": (v)=> <span>累计已鑄造<span class="text-base-content">{v?.amount||"..."} </span>$ALT</span>,
    "m.item_desc": (v)=> <span class="text-current/50">鑄造 <span class="text-base-content">{v?.amount||"..."} </span>$ALT 纳税 {v?.tax||"0"}</span>,
    "m.user" : "用户",
    "m.type" : "类型",
    "m.amount" : "数量",
    "m.tax" : "征税",
    "m.time" : "时间",
  })
  createEffect(()=>{
    console.log(agentStats())
  }
  )
  return(
  <>
  <Table class="w-full">
    <Caption>
    {t("m.desc",{
      link:"https://aolotto.org",
      text:"AolottoFoundation",
      ticker:  "ALT",
      amount: agentStats.state == "ready" ? toBalanceValue(agentStats()?.total_minted_amount,12) : "..."
    })}
    </Caption>
    <Head>
      <Cols>
        <Col class="text-left">{t("m.user")}</Col>
        <Col class="text-left">{t("m.type")}</Col>
        <Col class="md:text-left text-right">{t("m.amount")}</Col>
        <Col class="text-left hidden md:table-cell">{t("m.tax")}</Col>
        <Col class="text-right hidden md:table-cell">{t("m.time")}</Col>
        <Col class="text-center w-[1em]">-</Col>
      </Cols>
    </Head>
    <Body>
      {mintings()?.map((item,index)=>(
        <Row key={index}>
          <Cell>
            <div class="flex items-center gap-4 col-span-full lg:col-span-4">
              <Avatar username={item.address} class="size-7"/>
              <div className=' hidden md:block'><span class="text-current/50">{shortStr(item.address||"",8)}</span></div>
            </div>
          </Cell>
          <Cell>{item?.action == "Save-Ticket"? <div className="badge badge-accent uppercase rounded-full">Bet2mint</div> : <div className="badge badge-info uppercase rounded-full">gap-reward</div>}</Cell>
          <Cell className="text-right md:text-left">{toBalanceValue(item?.total,12)} <span className='text-current/50'>$ALT</span></Cell>
          <Cell className=" hidden md:table-cell">{toBalanceValue(item?.tax,12)} <span className='text-current/50'>$ALT</span></Cell>
          <Cell class="text-right hidden md:table-cell">
          <span class="text-current/50 "><Datetime ts={item.timestamp*1000}/></span>
          </Cell>
          <Cell class="text-center">
            <a href={info.ao_link_url + `/#/message/${item.id}`} target="_blank" class=" btn btn-ghost btn-square btn-link">
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