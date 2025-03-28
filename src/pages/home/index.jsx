import { createEffect, Show, Suspense } from "solid-js";
import { createResource } from "solid-js";
import { pool } from "../../data/resources";
import { useWallet } from "ar-wallet-kit";

export default props => {

  const {showConnector,address,connected,disconnect} = useWallet()
  // const [stats] =createResource(
  //   ()=>new AO().dryrun({process: pid, tags: { Action : "Stats" }}).then(({Messages})=>Messages?.[0].Data))
  // );
  createEffect(() => {
    console.log(pool()); // 获取 info 数据
  });

  return (
    <div>
      <Suspense>
        <h1>Home</h1>
        <button className="btn" onClick={showConnector} disabled={connected()} >{address()?address():"connect"}</button>
        <Show when={connected()}><button className="btn" onClick={disconnect}>Disconncet</button></Show>
      </Suspense>
    </div>
  );
}