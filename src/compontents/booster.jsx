import Modal from "./modal";
import { onMount,createResource,createEffect,createSignal, Switch, Match } from "solid-js";
import { fetchBalance } from "../api";
import { useApp,useWallet } from "../contexts";
import { boostStake } from "../api";
import toast from "solid-toast";
import { Table,Head,Body,Cols,Col,Cell,Row } from "./table";
import { Icon } from "@iconify-icon/solid";
import { toBalanceValue } from "../lib/tools";

export default props => {
  let _booster;
  const { info } = useApp();
  const { address,wallet } = useWallet();
  const [boosting, setBoosting] = createSignal(false);
  const [ balance, { refetch: refetchBalance }] = createResource(()=> ({pid: info?.alcog_process, address: address() }), fetchBalance);
  const boosted = () => {
    return props?.staker?.boosted > 1;
  }
  onMount(() => {
    props?.ref({
      open: () => {
        _booster?.open();
      },
      close: () => {
        _booster?.close();
      },
    });
  });
  createEffect(() => {
    console.log("ALC balance", balance());
  });
  const handlePayforBoost = async () => {
    setBoosting(true)
    boostStake({
      quantity: 1,
      token_id: info?.alcog_process,
      stake_id: info?.stake_process,
      wallet : wallet(),
    })
      .then((res) => {
        refetchBalance();
        _booster?.close();
        if(props?.onSubmit){
          props.onSubmit();
        }
      })
      .catch((err) => {
        console.error("Boosting failed:", err);
        toast.error("Boosting failed: " + err.message);
      })
      .finally(() => {
        setBoosting(false);
      })
  }

  return (
    <Modal ref={_booster} className="w-[360px] max-[360px]" title={()=>boosted()?"Boosted":"Boost with ALC"} closable = {!boosting()}>
      <Switch>
        <Match when={!boosted()}>
          <div className="pt-2 pb-4 px-5 flex flex-col justify-center items-center gap-4">
            <p className="text-sm ">Boost your account with an ALC NFT to raise the veALT multiplier to 1.2x, giving you more veALT for the same lock amount and period.</p>
            <Table>
              <Head>
                <Cols class="text-left">
                  <Col className="text-left text-xs">Current Balance</Col>
                  <Col className="text-right text-xs">After Boosted</Col>
                </Cols>
              </Head>
              <Body>
                <Row>
                  <Cell className="text-center text-xs">{()=>toBalanceValue(props?.staker?.balance,12,3)} veALT</Cell>
                  <Cell className="text-center text-xs">{()=>toBalanceValue(props?.staker?.balance * 1.2,12,3)} veALT</Cell>
                </Row>
              </Body>
            </Table>
            <div className="flex flex-col gap-2 w-full">
              <button 
                className="btn btn-primary w-full" 
                disabled={balance?.state !== "ready" || balance() < 1 || boosting()}
                onClick={handlePayforBoost}
              >
              {boosting() ? "Boosting..." : "Pay 1 ALC to Boost"}
            </button>
            <div className="flex items-center justify-between mt-2">
              <p className=" flex items-center gap-1 text-sm ">
                <span className="text-current/50 uppercase">ALC:</span>
                <span>{balance()} </span>
                <img src="https://arweave.net/PURLGdY5k7ujpBM_j_5XkKbnE9Rv9ta8cr7EOPWYRqk" alt="" className={`size-6 ${balance()>0?"":"grayscale"}`} />
              </p>
              <p className="text-right text-sm">
                <a className=" items-center flex gap-2" href="https://aopump.fun/#/trade/PURLGdY5k7ujpBM_j_5XkKbnE9Rv9ta8cr7EOPWYRqk" target="blank">Get an ALC <Icon icon="ei:external-link"></Icon></a>
              </p>
            </div>
            
            </div>
          </div>
        </Match>
        <Match when={boosted()}>
          <div className="p-4 flex flex-col justify-center items-center gap-4">
            <p className="text-center text-2xl">
            <Icon icon="streamline-pixel:interface-essential-flash" class="text-2xl text-secondary" />
            </p>
          
            <p className="text-center">Your account has been permanently boosted. Stake anytime and enjoy a {props?.staker?.boosted}x multiplier on your veALT balance. </p>
            <p className="text-center pb-4">
              <button 
                className="btn w-full"
                onClick={() => {
                  _booster?.close();
                }}
              >Yes,I know!</button>
            </p>
            
        </div>
        </Match>
      </Switch>
      
    </Modal>
  );
}