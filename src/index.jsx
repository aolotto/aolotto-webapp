/* @refresh reload */
import './index.css'
import { render } from 'solid-js/web'
import { HashRouter, Route } from "@solidjs/router";
import { ErrorBoundary, Match, Show, Suspense, Switch, createMemo, createSignal, onMount } from "solid-js"
import { Toaster } from 'solid-toast';
import { initwallet } from './components/wallet';
import { initApp,initProtocols } from './signals/global';
// import { isMobile } from './lib/ismobile';

// components
import Header from './components/header';
import Footer from './components/footer';
// pages
import Home from './pages/home';
import Bets from './pages/bets';
import Draws from './pages/draws';
import Ranks from './pages/ranks';
import ALT from './pages/alt';
import Me from './pages/me';
import Notfound from './pages/notfound';
import Upcomming from './pages/home/upcomming';

const App = props => {
  const launched = createMemo(()=>{
    const launch_tiem = import.meta.env.VITE_LAUNCH_TIME? Number(import.meta.env.VITE_LAUNCH_TIME):0
    return new Date().getTime() > launch_tiem
  })
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
          ao_link_url: import.meta.env.VITE_AO_LINK
        })
      ]).then((res)=>{
        if(res?.[0] == true && typeof res?.[1] == "object"){
          console.log("wallet initialized")
          initProtocols(import.meta.env.VITE_AGENT_PROCESS)
          .then((protocols)=>setInitialized(true))
        }
      })
      
    } catch (error) {
      console.log(error)
    }
  })
  return(
    <ErrorBoundary fallback={(e)=>{
      console.log("错误类型",typeof(e))
      console.log(e); 
      return <div class="text-secondary">ERROR: {e.message}</div>
    }}>

    <Show 
      when={initialized()} 
      fallback="Initialized Aolotto..."
    >
      <Switch>
          <Match when={!launched()}>{Upcomming}</Match>
          <Match when={launched()}>
          <div class="flex flex-col min-h-screen w-full items-center justify-between">
            <Header/>
            <div class="flex-1 w-full">{props.children}</div>
            <Footer/>
          </div>
          </Match>
        </Switch>
      <Toaster position="bottom-center" gutter={16}/>
    </Show>
    </ErrorBoundary>
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
    <Route path={["/coming/*"]} component={Upcomming}/>
    <Route path="*paramName" component={Notfound} />
  </HashRouter>
),  document.getElementById('root'))


