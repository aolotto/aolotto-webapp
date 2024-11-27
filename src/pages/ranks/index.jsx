import { Tabs } from "../../components/tabs"
import tooltip from "../../components/tooltip"
import Bettings from "./bettings"
import Winnings from "./winnings"

export default props => {
  return(
    <main class="container">
      <section class="response_cols">
        <div class="col-span-full">
          <Tabs items={[{
            label:"Bettings"
          },{
            label:"Winnings"
          }]}/>
        </div>
      </section>
      <div>
      <Bettings/>
      </div>
      
    </main>
  )
}