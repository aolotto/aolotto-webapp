import { handleConnection,connected,connecting,address } from "../../components/arwallet";
export default props => {
  return(
    <div class="w-full py-12">
      <h2>Welcome to Aolotto</h2>
      <p class="text-current/50">Connect your wallet first</p>
      <div><button class="btn btn-primary btn-lg" onClick={handleConnection} disabled={connecting()}>Connect</button></div>
    </div>
  )
}