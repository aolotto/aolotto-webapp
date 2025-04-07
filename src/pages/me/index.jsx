import { useWallet } from "arwallet-solid-kit"
import { Show } from "solid-js"
export default props => {
  const {connected, disconnect,address} = useWallet()
  return(
    <div className="container">
      <Show when={connected()} >
          <div>{address()} </div><button onClick={disconnect}>disconnect</button>
      </Show>
      
    </div>
  )
}