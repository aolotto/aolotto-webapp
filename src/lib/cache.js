export const cache = async(fn,{key,stale,refetch}) => {
  try {
    console.log("do cache",refetch,key,stale)
    let now = new Date().getTime();
    if(key&&localStorage.getItem(key)&&!refetch){
      
      const cached = JSON.parse(localStorage.getItem(key))
      if(cached&&now<=cached?.stale){
        return cached.data
      }
    }
    const data = await fn()
    if(!data) { 
      throw Error("no data return")
    }
    if(key){
      localStorage.setItem(key,JSON.stringify({
        data,
        stale: stale?now+stale:0
      }))
    }
    return data
    
  } catch (error) {
    throw new Error(error)
  }
}