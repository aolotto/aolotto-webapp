export default props => {
  return <div class="fixed top-0 left-0 w-full h-full">

  <div className="grid grid-cols-25 gap-2">
      {Array.from({ length: 1000 }, (_, i) => {
        let key = i.toString().padStart(3, '0')
        // let count = numbers()?.[key]
        return(
          <div>
            <button key={i} 
              className="number w-full"
              onClick={()=>{
                if(props?.onNumberClick){
                  props?.onNumberClick(key.split(''))
                }
              }}
            >
              <span className="relative z-1">{key}</span>
              {/* <Show when={count&&count > 0}>
                <span className="absolute inset-0 bg-secondary/50 z-0 w-full h-full" style={{opacity: `${count/maxcount*100}%`}}></span>
              </Show> */}
            </button> 
          </div>
        )
        })}
    </div>

  </div>
}