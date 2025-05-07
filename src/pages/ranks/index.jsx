import { createEffect, For } from "solid-js"
import { Table,Head,Body,Cols,Col,Row,Cell,Caption } from "../../compontents/table"
import Avatar from "../../compontents/avatar"
import { createResource } from "solid-js"
import { storeResource } from "../../store"
import { fetchRanks } from "../../api"
import { useApp } from "../../contexts"
import { setDictionarys,t } from "../../i18n"
import Spinner from "../../compontents/spinner"
import { toBalanceValue } from "../../lib/tools"

export default props => {
  const {info} = useApp()
  setDictionarys("en",{
    "r.bettings": "Top Bettings",
    "r.mintings": "Top Mintings",
    "r.winnings": "Top Winnings",
    "r.dividends": "Top Dividends",
  })
  setDictionarys("zh",{
    "r.bettings": "投注排行",
    "r.mintings": "鑄幣排行",
    "r.winnings": "獲獎排行",
    "r.dividends": "分紅排行",
  })
  const[ranks,{refetch}] = storeResource("ranks",()=>createResource(()=>info.agent_process,fetchRanks))
  createEffect(()=>console.log(ranks(),info.agent_process))
  return (
    
    <main className="container pb-12">
      <Suspense 
        fallback={<Spinner className="w-full h-[40vh]"/>}>

       
      <For each={[{
        emoji : "🏆",
        title : t("r.winnings"),
        data : ranks()?.winnings,
        format : (v)=> ("$"+toBalanceValue(v,6))
      },{
        emoji : "🎲",
        title : t("r.bettings"),
        data : ranks()?.bettings,
        format : (v)=> ("$"+toBalanceValue(v,6))
      },{
        emoji : "🪙",
        title : t("r.mintings"),
        data : ranks()?.mintings,
        format : (v)=> (toBalanceValue(v,12)+ " $ALT")
      }]}>
        {rank=>{
          return(
            <section>
              <Table>
                <Caption className="text-left px-1">
                  <div className="flex items-center gap-2">
                    <span className=" inline-block w-[2em]">{rank.emoji}</span>
                    <span className="text-current/50 uppercase">{rank.title}</span>
                  </div>
                </Caption>
                <Body>
                  <For each={rank.data}>
                    {(item,index)=>{
                      const [i] = Object.entries(item)
                      return(
                        <Row>
                          <Cell className="w-[2em]">{index()+1}</Cell>
                          <Cell>
                            <div className=" truncate flex items-center gap-2 max-w-[40vw]">
                            <Avatar username={i[0]} className=" size-6"/>
                            <span>{i[0]}</span>
                            </div>
                            
                          </Cell>
                          <Cell className="text-right">{rank.format(i[1])}</Cell>
                        </Row>
                      )
                    }}
                  </For>
                  
                </Body>
              </Table>
            </section>
          )
        }}

      </For>
      </Suspense>
    </main>
  )
}