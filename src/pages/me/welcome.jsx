
import { handleConnection,connecting } from "../../components/wallet";
import { setDictionarys,t } from "../../i18n";
export default props => {
  setDictionarys("en",{
    "w.welcome": "Welcome to Aolotto",
    "w.connect": "Connect your AR wallet first",
    "w.download": ()=><span>ArConnect is recommended, <a href="https://www.arconnect.io/download" target="_blank">Click here</a> to download.</span>,
    "connect": "Connect",
    "conecting": "Connecting..."
  })
  setDictionarys("zh",{
    "w.welcome": "歡迎來到Aolotto",
    "w.connect": "請先連接您的AR錢包",
    "w.download": ()=><span>建議使用ArConnect，<a href="https://www.arconnect.io/download" target="_blank">點擊這裡</a>下載</span>,
    "connect": "链接",
    "connecting": "连接中..."
  })
  return(
    <div class="w-full py-12 flex flex-col items-center justify-center gap-4">
      <h2 class="text-2xl">{(t("w.welcome"))}</h2>
      <p class="text-current/50">{(t("w.connect"))}</p>
      <div><button class="btn btn-primary btn-lg" onClick={handleConnection} disabled={connecting()}>{connecting()?t("connecting"):t("connect")}</button></div>
      <div class="text-sm">{t("w.download")}</div>
    </div>
  )
}