import { createResource,createSignal,createEffect,batch } from "solid-js"
import { query,createAsync } from "@solidjs/router"






export const createPagination = (signal, fetcher, options) => {
  let size = options?.size || 100
  const [hasMore,setHasMore] = createSignal(false)
  const [page,setPage] = createSignal(1)
  const [loadingMore,setLoadingMore] = createSignal(false)
  const [res,{refetch,mutate}] = createResource(()=>([signal(),{size}]),fetcher)
  const loadMore = async()=>{
    if(hasMore()&&!loadingMore()){
      setLoadingMore(true)
      const length = res()?.length
      const newRes = await fetcher([signal(),{size,page:page(),cursor:res()?.[length-1]?.cursor}],{refetching:false})
      batch(()=>{
        mutate((current)=>{
          return [...(current||[]),...newRes||[]]
        })
        setPage(page()+1)
        setLoadingMore(false)
      })
    }
  }
  createEffect(()=>setHasMore(res()?.length>=size*page()))
  return [res,{refetch,hasMore,loadingMore,loadMore},{size,page}]
}



