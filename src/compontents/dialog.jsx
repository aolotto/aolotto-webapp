import { createSignal, onMount,createEffect, Show } from "solid-js"
import mergeClasses from "@robit-dev/tailwindcss-class-combiner"

export default props => {
  const [visible,setVisible] = createSignal(false)
  const handleShow = ()=>{
    setVisible(true)
    props?.onOpen&&props?.onOpen()
  }
  const handleHide = ()=>{
    setVisible(false)
    props?.onClose&&props?.onClose()
  }
  onMount(()=>{
    props?.ref({
      open:(e)=>{
        handleShow()
      },
      close:(e)=>{
        handleHide()
      }
    })
  })
  createEffect(()=>{
    if(visible()){
      document.body.style.overflow = 'hidden';
    }else{
      document.body.style.overflow = 'auto';
    }
  })
  return(
    <div
      ref={props?.ref}
      id={props?.id}
      class="static top-0 left-0 h-0 w-0 z-[996] overflow-visible"
      style={{ visibility: `${visible() ? "visible" : "hidden"}` }}
    >
      <div 
        className="w-[100vw] h-[100vh] fixed inset-0 p-2em z-[998] flex flex-col items-center justify-center pointer-events-none transition-all duration-300"
        classList={{
          "translate-y-0 opacity-100" : visible(),
          "translate-y-100 opacity-0" : !visible()
        }}
      >
        <div 
          className={mergeClasses("bg-base-100/95 backdrop-blur-3xl flex flex-col shadow-2xl pointer-events-auto overflow-scroll",`${props?.className || props?.class}`)}
          classList={{
            "max-w-[calc(100vw-16px)] lg:max-w-7xl rounded-2xl border border-base-content/30" : !props?.fullscreen,
            "min-w-full min-h-full md:min-w-[360px] md:border md:border-base-content/30 md:min-h-[600px] max-w-[100vw] max-h-[100vh] md:rounded-2xl" : props?.fullscreen && props?.responsive,
            "min-w-full min-h-full max-w-[100vw] max-h-[100vh] md:border md:border-base-content/30 md:min-w-[calc(100vw-32px)] md:min-h-[calc(100vh-32px)] lg:min-w-[calc(100vw-64px)] lg:min-h-[calc(100vh-64px)] md:rounded-2xl" : props?.fullscreen && !props?.responsive
          }}
        >
          <Show when={props?.title}>
            <div className="flex items-center justify-between p-2 min-h-12">
              <h2 className="text-lg ml-3 font-bold">{props?.title}</h2>
              <button className="btn btn-circle btn-ghost" onClick={handleHide} disabled={props?.disclosable}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className=" scale-200" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"></path></svg></button>
            </div>
          </Show>
          <div className="w-full flex-1 overflow-scroll flex flex-col">{props.children}</div>
        </div>
      </div>
      <button
        disabled={!props?.closable||props?.disclosable}
        onClick={handleHide}
        className=" fixed top-0 left-0 bg-base-content/20 w-[100vw] h-[100vh] transition-all duration-500 z-[997]"
        classList={{
          "opacity-0" : ! visible(),
          "opacity-100" : visible()
        }}
      >
      </button>
    </div>
  )
}