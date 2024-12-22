/* @refresh reload */
import './index.css'
import { render } from 'solid-js/web'
import { HashRouter, Route } from "@solidjs/router";
import { Show, createSignal, onMount, createMemo } from "solid-js"
import { Toaster } from 'solid-toast';
import { initwallet } from './components/arwallet';
import { initApp,initPool,initAgent,initCurrency,initProtocols } from './signals/global';

// components
import Header from './components/header';
import Footer from './components/footer';
// pages
import Home from './pages/home';
import Bets from './pages/bets';
import Draws from './pages/draws';
import Stats from './pages/stats';
import ALT from './pages/alt';
import Me from './pages/me';
import Notfound from './pages/notfound';
import Test from './pages/test'

const App = props => {
  const [initialized,setInitialized] = createSignal(false)
  onMount(async()=>{
    try {
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
        ao_link_url: import.meta.env.VITE_AO_LINK
      })
      initProtocols(import.meta.env.VITE_AGENT_PROCESS)
      .then((protocols)=>Promise.all([
        initPool(protocols?.pool_id),
        initAgent(protocols?.agent_id),
        initCurrency(protocols?.pay_id)
      ])
      .then(()=>{
        setInitialized(true)
      }))
    } catch (error) {
      console.log(error)
    }
  })
  return(
    <Show 
      when={initialized()} 
      fallback="initialized..."
    >
      <div class="flex flex-col min-h-screen w-full items-center justify-between">
        <Header/>
        <div class="flex-1 w-full">{props.children}</div>
        <Footer/>
      </div>
      <Toaster position="bottom-center" gutter={16}/>
    </Show>
  )
}

render(() => (
  <HashRouter root={App}>
    <Route path={["/", "/home"]} component={Home} />
    <Route path={["/bets/*"]} component={Bets} />
    <Route path={["/draws/*"]} component={Draws} />
    <Route path={["/stats/*"]} component={Stats} />
    <Route path={["/alt/*"]} component={ALT} />
    <Route path={["/me/*"]} component={Me} />
    <Route path={["/test/*"]} component={Test}/>
    <Route path="*paramName" component={Notfound} />
  </HashRouter>
),  document.getElementById('root'))


