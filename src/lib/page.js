import { createResource,createSignal,createEffect, createMemo,batch } from "solid-js"




export const createPages = (signal, fetcher, options) => {
  let size = options?.size || 100
  const [hasMore,setHasMore] = createSignal(false)
  const [page,setPage] = createSignal(1)
  const [loadingMore,setLoadingMore] = createSignal(false)
  const [res,{refetch,mutate}] = createResource(()=>([signal(),{size,cursor:null}]),fetcher)
  const loadMore = async(cursor)=>{
    if(hasMore()){
      setLoadingMore(true)
      const newRes = await fetcher([signal(),{size,cursor:null}])
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