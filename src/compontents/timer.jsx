import { createSignal,onMount,onCleanup } from "solid-js"

export default props => {
  let timer
  let start = props.start || new Date().getTime()+86400000
  const [count,setCount] = createSignal("00:00:00")
  onMount(()=>{
    timer = setInterval(()=>{
      const now = new Date().getTime()
      const diff = (now - start) / 1000
      let day = Math.floor(diff / 60 / 60 / 24).toString().padStart(2, "0");
      let hour = Math.floor(diff / 60 / 60 % 24 ).toString().padStart(2, "0");
      let minute = Math.floor(diff / 60 % 60).toString().padStart(2, "0");
      let second = Math.floor(diff % 60).toString().padStart(2, "0");
      setCount(day!="00"?`${day}:${hour}:${minute}:${second}`:`${hour}:${minute}:${second}`)
    },1000)
  })
  onCleanup(()=>{
    clearInterval(timer)
  })
  return <div class={props.class||props.className}>{count()}</div>
}