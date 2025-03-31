/* @refresh reload */
import { render } from 'solid-js/web'
import { Suspense } from 'solid-js'
import './index.css'
import { HashRouter, Route } from "@solidjs/router"
import { AppProvider } from './data'
import { WalletProvider,WanderStrategy } from "ar-wallet-kit"
import AoSyncStrategy from "@vela-ventures/aosync-strategy";
import WebWalletStrategy from "@arweave-wallet-kit/webwallet-strategy";
import OthentStrategy from "@arweave-wallet-kit/othent-strategy";


import Spinner from './compontents/spinner'
import Header from './compontents/header'
import Footer from './compontents/footer'

import Home from './pages/home'
import Bets from './pages/bets'



const App = props => {
  return (
    <Suspense fallback={<Spinner/>}>
      <AppProvider>
        <div className='flex flex-col min-h-screen w-full items-center justify-between'>
          <Header/>
          <main className='flex-1 w-full'>
            {props.children}
          </main>
          <Footer/>
        </div>
      </AppProvider>
    </Suspense>
  )
}
render(() => (
  <WalletProvider config={{
    permissions: [
      "ACCESS_ADDRESS","SIGN_TRANSACTION","DISPATCH","ACCESS_PUBLIC_KEY",
    ],
    appInfo :{
      name : "Aolotto"
    },
    ensurePermissions: true,
    strategies: [
      new WanderStrategy(),
      new OthentStrategy(),
      new WebWalletStrategy(),
      new AoSyncStrategy()
    ]
  }}>
    <HashRouter root={App}>
      <Route path={["/", "/home"]} component={Home} />
      <Route path="/bets/*" component={Bets} />
    </HashRouter>
  </WalletProvider>
),  document.getElementById('root'))
