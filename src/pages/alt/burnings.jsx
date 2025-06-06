import { Table, Head, Body, Row, Cell, Col, Cols, Caption, Actions } from '../../compontents/table';
import { createPagination } from '../../lib/pagination';
import { useApp } from '../../contexts';
import { storeResource } from '../../store';
import { fetchAltBurnings } from '../../api';
import { createEffect, Suspense } from 'solid-js';
import { t, setDictionarys } from '../../i18n';
import { Icon } from '@iconify-icon/solid';
import Skeleton from '../../compontents/skeleton';
import Spinner from '../../compontents/spinner';
import { shortStr,toBalanceValue } from '../../lib/tools';
import Avatar from '../../compontents/avatar';
import { Datetime } from '../../compontents/moment';
import Loadmore from '../../compontents/loadmore';
export default function Stakings(props) {
  const { info } = useApp()
  const [burnings,{loadMore,loadingMore,hasMore}] = storeResource("alt_burnings",()=>createPagination(
    ()=>({ agent_id : info?.agent_process, alt_id : info?.alt_process }),
    fetchAltBurnings,
    {size: 100}
  ))
  setDictionarys("en",{ 
    "m.desc": (v)=> <span><span class="text-base-content">{v?.amount||"..."} </span>${v.ticker} were minted via Bet2Mint, with {v?.tax || "0"} collected as tax by <a href={v?.link} target="_blank" class="inline-flex items-center text-base-content">{v?.text} <Icon icon="ei:external-link"></Icon></a>.</span>,
    "m.item_desc": (v)=> <span class="text-current/50">Minted <span class="text-base-content">{v?.amount||"..."} </span>$ALT with tax {v?.tax||"0"}</span>,
    
  })
  setDictionarys("zh",{
    "m.desc": (v)=> <span>通過Bet2Mint鑄造了<span class="text-base-content">{v?.amount||"..."} </span>$ALT，其中{v?.tax || "0"}枚铸币税由<a href={v?.link} target="_blank" class="inline-flex items-center text-base-content">{v?.text} <Icon icon="ei:external-link"></Icon></a>征收。</span>,
    "m.item_desc": (v)=> <span class="text-current/50">鑄造 <span class="text-base-content">{v?.amount||"..."} </span>$ALT 纳税 {v?.tax||"0"}</span>
  })
  createEffect(()=>{
    console.log(burnings())
  }
  )
  return(
    <>
    <Table class="w-full">
    <Head>
      <Cols>
        <Col class="text-left">User</Col>
        <Col class="text-left">Amount</Col>
        <Col class="text-right hidden md:table-cell">Time</Col>
        <Col class="text-center w-[1em]">-</Col>
      </Cols>
    </Head>
    <Body>
      {burnings()?.map((item,index)=>(
        <Row key={index}>
          <Cell>
            <div class="flex items-center gap-4 col-span-full lg:col-span-4">
              <Avatar username={item.address} class="size-7"/>
              <div className=' hidden md:block'><span class="text-current/50">{shortStr(item.address||"",8)}</span></div>
            </div>
          </Cell>
          <Cell >{toBalanceValue(item?.quantity,12)} <span className='text-current/50'>$ALT</span></Cell>
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