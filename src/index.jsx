/* @refresh reload */
import './index.css'
import { render } from 'solid-js/web'
import { HashRouter, Route } from "@solidjs/router";
import {  Match, Show,  Switch, createMemo, createSignal, onMount } from "solid-js"
import { Toaster } from 'solid-toast';
import { initwallet } from './components/wallet';
import { initApp,initProtocols } from './data/info';
import { isUpgradeBrowser } from './lib/browser';
import { isMobile } from './lib/ismobile';


// components
import Header from './components/header';
import Footer from './components/footer';
import Spinner from './components/spinner';
// pages
import Home from './pages/home';
import Bets from './pages/bets';
import Draws from './pages/draws';
import Ranks from './pages/ranks';
import ALT from './pages/alt';
import Me from './pages/me';
import Notfound from './pages/notfound';
import Mobile from './pages/home/mobile';
import Alert from './pages/alert';
import Divs from './pages/divs';

const App = props => {
  const {isUpdate,browser,versions,lowestVersions=''} = isUpgradeBrowser()
  if (isUpdate) {
      alert(`Your current ${browser} browser version is too low (version ${versions}). It is recommended that you visit a webpage with a version no lower than ${lowestVersions}. If you cannot access the page, please upgrade your browser version and try again!`)
      return
  }
  
  const [initialized,setInitialized] = createSignal(false)
  
  onMount(async()=>{
    try {
      
      Promise.all([
        initwallet({
          permissions:["ACCESS_ADDRESS","SIGN_TRANSACTION"],
          appInfo:{
            name: import.meta.env.VITE_APP_NAME || "Aolotto"
          },
          gateWay:{
            host: import.meta.env.VITE_GATEWAY || "arweave.net",
            port: 443,
            protocol: "https"
          },
          gqlEndpoint: import.meta.env.VITE_GQL_ENDPOINT || "https://arweave-search.goldsky.com/graphql"
        }),
        initApp({
          name: import.meta.env.VITE_APP_NAME || "Aolotto",
          app_host: import.meta.env.VITE_APP_HOST || "https://aolotto.com",
          ar_getway: import.meta.env.VITE_GATEWAY_URL || "https://arweave.net",
          version: import.meta.env.VITE_APP_VERSION || "beta",
          mode: import.meta.env.MODE || "dev",
          pool_id: import.meta.env.VITE_POOL_PROCESS,
          token_id: import.meta.env.VITE_TOKEN_PROCESS,
          agent_id: import.meta.env.VITE_AGENT_PROCESS,
          env: import.meta.env,
          ao_link_url: import.meta.env.VITE_AO_LINK,
        })
      ]).then((res)=>{
        if(res?.[0] == true && typeof res?.[1] == "object"){
          initProtocols(import.meta.env.VITE_AGENT_PROCESS,"020")
          .then((protocols)=>setInitialized(true))
        }
      })
      
    } catch (error) {
      console.log(error)
    }
  })
  return(
    <Show 
      when={initialized()} 
      fallback={<Spinner size="lg">Initialization...</Spinner>}
    >
      <Switch>
          <Match when={isMobile()}>{Mobile}</Match>
          <Match when={!isMobile()}>
          <div class="flex flex-col min-h-screen w-full items-center justify-between">
            <Header/>
            <div class="flex-1 w-full">{props.children}</div>
            <Footer/>
          </div>
          </Match>
        </Switch>
      <Toaster position="bottom-center" gutter={16}/>
    </Show>
  )
}

render(() => (
  <HashRouter root={App}>
    <Route path={["/", "/home"]} component={Home} />
    <Route path={["/bets/*"]} component={Bets} />
    <Route path={["/draws/*"]} component={Draws} />
    <Route path={["/rank/*"]} component={Ranks} />
    <Route path={["/alt/*"]} component={ALT} />
    <Route path={["/me/*"]} component={Me} />
    <Route path={["/alert/*"]} component={Alert}/>
    <Route path={["/divs/*"]} component={Divs}/>
    <Route path="*paramName" component={Notfound} />
  </HashRouter>
),  document.getElementById('root'))


