/* @refresh reload */
import './index.css'
import { render } from 'solid-js/web'
import { Suspense,ErrorBoundary } from 'solid-js'
import { Toaster } from 'solid-toast';
import { HashRouter, Route } from "@solidjs/router"
import { AppProvider,UserProvider } from './contexts'
import { WalletProvider } from "arwallet-solid-kit"
import AoSyncStrategy from "@vela-ventures/aosync-strategy";
import WebWalletStrategy from "@arweave-wallet-kit/webwallet-strategy";
import OthentStrategy from "@arweave-wallet-kit/othent-strategy";
import WanderStrategy from "@arweave-wallet-kit/wander-strategy"


import Spinner from './compontents/spinner'
import Header from './compontents/header'
import Footer from './compontents/footer'

import Home from './pages/home'
import Bets from './pages/bets'
import Me from './pages/me'
import Ranks from "./pages/ranks"
import Divs from "./pages/divs"
import Draws from './pages/draws';
import ALT from './pages/alt';



const App = props => {
  return (
    <ErrorBoundary
        fallback={(error, reset) => (
          <div>
            <p>Something went wrong: {error.message}</p>
            <button onClick={reset}>Try Again</button>
          </div>
        )}
      >
    <Suspense fallback={<Spinner className="w-full h-[100vh] flex-col">Aolotto</Spinner>}>
      <AppProvider>
        <UserProvider>
          <div className='flex flex-col min-h-screen w-full items-center justify-between'>
            <Header/>
            <main className='flex-1 w-full'>
            {props.children}
            </main>
            <Footer/>
            <Toaster position="bottom-left" gutter={8}/>
          </div>
        </UserProvider>
      </AppProvider>
    </Suspense>
    </ErrorBoundary>
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
      <Route path={["/", "/home/*"]} component={Home} />
      <Route path="/bets/*" component={Bets} />
      <Route path="/me/*" component={Me} />
      <Route path="/rank/*" component={Ranks} />
      <Route path="/divs/*" component={Divs} />
      <Route path="/draws/*" component={Draws} />
      <Route path="/alt/*" component={ALT} />
    </HashRouter>
  </WalletProvider>
),  document.getElementById('root'))
