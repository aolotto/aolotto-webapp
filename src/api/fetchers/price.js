import { AO } from "../ao";
let ao = new AO()
export const fetchPrice = (pid,{refetching,value}) => {
   try {
    console.log("fetchPrice",pid)
      if (!pid) return;
      return ao.dryrun(pid,{Action: "Info"})
      .then(({ Messages }) => {
        if (Messages?.[0]?.Tags) {
          const tags = { Id : pid}
          for (const e of Messages?.[0]?.Tags) {
            tags[e.name] = e.value
          }

          const decimal_x = Number(tags?.DecimalX || 0);
          const decimal_y = Number(tags?.DecimalY || 0);
          const px = Number(tags?.PX || 0);
          const py = Number(tags?.PY || 0);
          return (py/(10**decimal_y))/(px/(10**decimal_x))

          // storage.set(key, tags, { ttl: 86400000, type: 'localStorage' });
          // return tags;
        }
      });
    } catch (error) {
      console.error(error)
      throw error;
    }
}