import { createEffect, Suspense } from "solid-js";
import { createResource } from "solid-js";
import { pool } from "../../data/resources";

export default props => {


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
      </Suspense>
    </div>
  );
}