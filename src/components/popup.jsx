import { createEffect,createSignal,onMount,createContext, useContext } from "solid-js"
import mergeClasses from "@robit-dev/tailwindcss-class-combiner"
import { Icon } from "@iconify-icon/solid"

const ModalContext = createContext();

export const Modal = props =>{
  
  const [visible,setVisible] = createSignal(false)

  const handleOpen = (e) => {
    setVisible(true)
    if(props?.onOpen&&typeof(props?.onOpen)=="function"){
      props.onOpen(e)
    }

  }

  const handleClose = (e) => {
    setVisible(false)
    if(props?.onClose&&typeof(props?.onClose)=="function"){
      props.onClose(e)
    }

  }

  onMount(()=>{
    props?.ref({
      open:handleOpen,
      close:handleClose,
    })
  })

  createEffect(()=>{
    if(visible()){
      document.body.style.overflow = 'hidden';
    }else{
      document.body.style.overflow = 'auto';
    }
  })
  
  return (
    <ModalContext.Provider value={{
      handleOpen,
      handleClose,
      visible
    }}>
      <div class="static top-0 left-0 h-0 w-0 z-[9998] invisible">
      <Show when={props?.mask}>
        <div 
          class={mergeClasses(
            "mask w-full h-full fixed top-0 left-0 bottom-0 right-0 bg-base-content/5 backdrop-blur-lg !z-[9999] transition-all",
            props?.maskClass
          )}
          classList = {{
            "visible opacity-100": visible(),
            "invisible opacity-0" : !visible()
          }}
          onClick={()=>{
            if(props?.closable){
              handleClose()
            }
          }}
        > </div>
      </Show>
      <div 
        class={mergeClasses(
          "bg-base-100 flex-col !z-[10000] fixed transition-all rounded-[1em] [&>section]:w-full [&>section]:px-[1em] [&>section]:first:pt-[1em] [&>section]:last:pb-[1em] flex justify-center items-center drop-shadow-black drop-shadow-2xl",
          props.className || props.class
        )}
        classList={{
          " scale-100 opacity-100 visible" : visible(),
          " scale-0 opacity-0 invisible" : !visible(),
          "left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]" : !props.position || props?.position == "center",
          "left-0 top-0" : props?.position == "top-left",
          "top-0 right-0" : props?.position == "top-right",
          "left-0 bottom-0" : props?.position == "bottom-left",
          "bottom-0 right-0" : props?.position == "bottom-right",
        }}
      >
        {/* <div class={mergeClasses(
          "bg-base-0 rounded-[1em] drop-shadow-black drop-shadow-2xl text-base-content [&>section]:px-[1em] [&>section]:first:pt-[1em] [&>section]:last:pb-[1em] flex flex-col justify-between border border-current/5 inset-1", 
          props.className || props.class
        )}>
          
        </div> */}
        {props?.children}
      </div>
    </div>
    </ModalContext.Provider>
  );
}

function useModalContext() {
  return useContext(ModalContext)
}


export const ModalHeader = props => {
  const context = useModalContext()
  return (
    <Show 
      when={props?.children}
      fallback={
        <section class="w-full flex items-center justify-between">
          <h2 class="text-md font-bold text-current/80 h-[1.5em]">{props.title}</h2>
          <button class="btn btn-square btn-ghost rounded-full" onClick={context?.handleClose} disabled={props?.disabled}>
            <iconify-icon icon="iconoir:cancel"></iconify-icon>
          </button>
        </section>
      }
    >
      {props.children}
    </Show>
  )
}


export const ModalContainer = props => {
  return (
    <Show when={props?.children} fallback={
      <section class={mergeClasses("flex-1",props?.class||props?.className)}>
        {props.value}
      </section>
    }>
      <div class={mergeClasses("flex-1",props?.class||props?.className)}>
      {props?.children}
      </div>
      
    </Show>
    
  )
}

export const ModalFooter = props => {
  return (
    <Show when={props?.children} fallback={
      <section class={mergeClasses("", props?.class||props?.className)}>
        {props.value}
      </section>
    }>
      <div class={mergeClasses("w-full", props?.class||props?.className)}>
        {props?.children}
      </div>
    </Show>
  )
}