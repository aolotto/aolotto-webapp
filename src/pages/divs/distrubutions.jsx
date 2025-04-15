import { Table, Body, Head, Row, Cell, Cols, Col, Caption, Actions } from "../../compontents/table"
import { For } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import Loadmore from "../../compontents/loadmore"
export default props => {
  return (
    <div>
      <Table>
        <Caption>Next Distribution : 14/04/2025, 08:00:00</Caption>
        <Head>
          <Cols>
            <Col>NO</Col>
            <Col className=" hidden md:table-cell">Date</Col>
            <Col className="p-2">Amount</Col>
            <Col className=" hidden md:table-cell">Addresses</Col>
            <Col className="text-right">Details</Col>
          </Cols>
        </Head>
        <Body>
          <For each={[8, 7, 6, 5, 4, 3, 2, 1]}>
            {item => (
              <Row>
                <Cell>1</Cell>
                <Cell className=" hidden md:table-cell">13/04/2025, 08:00:00</Cell>
                <Cell className="p-2">
                  <div className=" flex flex-col gap-2">
                    <div className="font-bold">$1.2</div>
                    <div className=" inline-flex md:hidden items-center divide-x divide-base-300 text-xs text-current/50">
                      <span className=" inline-flex items-center pr-2 gap-2"><Icon icon="iconoir:profile-circle" className="text-[1em]" /> 64</span>
                      <span className=" inline-flex items-center pl-2 gap-2">13/04/2025, 08:00:00</span>
                    </div>
                  </div>
                </Cell>
                <Cell className=" hidden md:table-cell">64</Cell>
                <Cell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-current/50 hidden md:inline-flex">Zzql...MEniU</span>
                    <a href={`https://www.ao.link/#/message/${item.id}`} target="_blank"><Icon icon="ei:external-link" /></a>
                  </div>
                </Cell>
              </Row>
            )}
          </For>
        </Body>

      </Table>
      <Actions className=" ">
        <Loadmore />
      </Actions>
    </div>
  )
}