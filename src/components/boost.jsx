import { onMount } from "solid-js"
import { Icon } from "@iconify-icon/solid"
export default props => {
  let _boost
  onMount(() => {
    props.ref({
      open: () => {
        _boost.showModal()
      },
      close: () => {
        _boost.close()
      },
    })
  })
  return (
    <dialog
      id="locker"
      className="modal"
      onCancel={(e) => {
        e.preventDefault()
        return
      }}
      ref={_boost}
    >
      <div className="modal-backdrop backdrop-blur-2xl"></div>
      <div className="modal-box rounded-2xl max-w-[360px]">
        {/* top */}
        <section className="modal-top	">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-circle btn-ghost absolute right-2 top-4"
            >
              <Icon icon="iconoir:cancel" class=" scale-150"></Icon>
            </button>
          </form>
          <h3 className="text-lg">Boosting the locking rate</h3>
        </section>
        {/* main */}
        <section class="pt-6 text-sm">
          <p>
          As AO upgrades from legacynet to mainnet, ecosystem apps remain unstable. Users face issues buying ALC from aopump.fun, and ALC boosting for locking is temporarily unavailable to ensure fair daily dividends, Stay tuned for updates!
          </p>
        </section>
        {/* action */} 
        <section className="modal-action justify-between items-center">
          <a>Learn more</a>
          <button className="btn btn-primary" onClick={()=>_boost.close()}>Yes,I konw</button>
        </section>
      </div>
    </dialog>
  )
}