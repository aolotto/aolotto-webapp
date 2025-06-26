import Modal from "./modal";
import { onMount,createResource,createEffect,createSignal, Switch, Match, Show,Suspense } from "solid-js";
import { fetchBalance } from "../api";
import { useApp,useWallet } from "../contexts";
import { boostStake } from "../api";
import toast from "solid-toast";
import { Table,Head,Body,Cols,Col,Cell,Row } from "./table";
import { Icon } from "@iconify-icon/solid";
import { toBalanceValue } from "../lib/tools";
import Skeleton from "./skeleton";
import { storeResource } from "../store";
import Spinner from "./spinner";
import { setDictionarys,t } from "../i18n";

export default props => {
  setDictionarys("en",{
    "alc.booster.title": "Boost with ALC",
    "alc.booster.desc": "Boost your account with an ALC NFT to raise the veALT multiplier to 1.2x, giving you more veALT for the same lock amount and period.",
    "alc.booster.current_balance": "Current Balance",
    "alc.booster.after_boosted": "After Boosted",
    "alc.booster.pay": "Pay 1 ALC to Boost",
    "alc.booster.get_alc": "Get an ALC",
    "alc.booster.alc_balance": "ALC Balance",
    "alc.booster.boosted": "Boosted",
    "alc.booster.alc": "ALC",
    "alc.booster.alc_desc": "ALC is a special NFT that boosts your veALT multiplier to 1.2x, allowing you to earn more veALT for the same lock amount and period. You can get ALC from the AOPump marketplace.",
    "alt.boosted" : "Your account has been permanently boosted. Stake anytime and enjoy a 1.2x multiplier on your veALT balance.",
    "alc.yes_i_know": "Yes, I know!",
    "alc.btn.pay" : "Pay 1 ALC to Boost",
  });
  setDictionarys("zh",{
    "alc.booster.title": "使用 ALC 提升",
    "alc.booster.desc": "使用 ALC NFT 提升您的账户，将 veALT 乘数提高到 1.2x，使您在相同的锁定金额和期限内获得更多的 veALT。",
    "alc.booster.current_balance": "当前余额",
    "alc.booster.after_boosted": "提升后",
    "alc.booster.pay": "支付 1 ALC 进行提升",
    "alc.booster.get_alc": "获取 ALC",
    "alc.booster.alc_balance": "ALC 余额",
    "alc.booster.boosted": "已提升",
    "alc.booster.alc": "ALC",
    "alc.booster.alc_desc": "ALC 是一种特殊的 NFT，可以将您的 veALT 乘数提升到 1.2x，使您在相同的锁定金额和期限内获得更多的 veALT。您可以在 AOPump 市场上获取 ALC。",
    "alt.boosted" : "您的账户已永久提升。随时进行质押，享受 1.2x 的 veALT 余额乘数。",
    "alc.yes_i_know": "是的，我知道！",
    "alc.btn.pay" : "支付 1 ALC 进行提升",
  });
  let _booster;
  const { info } = useApp();
  const { address,wallet } = useWallet();
  const [boosting, setBoosting] = createSignal(false);
  const [ balance, { refetch: refetchBalance }] = storeResource("alc_balance_"+address(),()=>createResource(()=> ({pid: info?.alcog_process, address: address() }), fetchBalance));
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
    
    <Suspense fallback={<Spinner class="w-6 h-6" />}>

    
      
      <Switch >
        <Match when={!boosted()}>
          <div className="pt-2 pb-4 px-5 flex flex-col justify-center items-center gap-4">
            <p className="text-sm ">{t("alc.booster.desc")}</p>
            <Table>
              <Head>
                <Cols class="text-left">
                  <Col className="text-left text-xs">{t("alc.booster.current_balance")}</Col>
                  <Col className="text-right text-xs">{t("alc.booster.after_boosted")}</Col>
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
                disabled={()=>balance?.state != "ready" || balance() < 1 || boosting() || !address() || !balance()}
                onClick={handlePayforBoost}
              >
              {boosting() ? "Boosting..." : t("alc.btn.pay")}
            </button>
            <div className="flex items-center justify-between mt-2">
              <p className=" flex items-center gap-1 text-sm ">
                <span className="text-current/50 uppercase">ALC:</span>
                <span><Show when={balance?.state == "ready"} fallback={<Skeleton w={2} h={1} />}>{balance()}</Show> </span>
                <img src="https://arweave.net/PURLGdY5k7ujpBM_j_5XkKbnE9Rv9ta8cr7EOPWYRqk" alt="" className={`size-6 ${balance()>0?"":"grayscale"}`} />
              </p>
              <p className="text-right text-sm">
                <a className=" items-center flex gap-2" href="https://aopump.fun/#/trade/PURLGdY5k7ujpBM_j_5XkKbnE9Rv9ta8cr7EOPWYRqk" target="blank">{t("alc.booster.get_alc")} <Icon icon="ei:external-link"></Icon></a>
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
          
            <p className="text-center">{t("alt.boosted")} </p>
            <p className="text-center pb-4">
              <button 
                className="btn w-full"
                onClick={() => {
                  _booster?.close();
                }}
              >{t("alc.yes_i_know")}</button>
            </p>
            
        </div>
        </Match>
      </Switch>
      </Suspense>
    </Modal>
  );
}