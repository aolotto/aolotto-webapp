import { For } from "solid-js"
import { Table,Head,Body,Cols,Col,Row,Cell,Caption } from "../../compontents/table"
import Avatar from "../../compontents/avatar"
export default props => {
  return (
    <div className="container pb-12">
      <For each={[1,2,3,4]}>
        {tab=>{
          return(
            <section>
              <Table>
                <Caption className="text-left px-1">
                  <div className="flex items-center gap-2">
                    <span className=" inline-block w-[2em]">🏆</span>
                    <span className="text-current/50 uppercase">Top Bettings</span>
                  </div>
                </Caption>
                <Body>
                  <For each={[1,2,3,4,5,6,7,8,9,10]}>
                    {item=>(
                      <Row>
                        <Cell className="w-[2em]">{item}</Cell>
                        <Cell>
                          <div className=" truncate flex items-center gap-2 max-w-[40vw]">
                          <Avatar username="SArwiWAAcDYTwmEkAIWjfBb8jEKoyCafaGV7pEhWehM" className=" size-6"/>
                          <span>SArwiWAAcDYTwmEkAIWjfBb8jEKoyCafaGV7pEhWehM</span>
                          </div>
                          
                        </Cell>
                        <Cell className="text-right">$1,866.625</Cell>
                      </Row>
                    )}
                  </For>
                  
                </Body>
              </Table>
            </section>
          )
        }}

      </For>
      
    </div>
  )
}