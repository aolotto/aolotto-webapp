/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import { HashRouter, Route } from "@solidjs/router"
import { WalletProvider,WanderStrategy,OthentStrategy } from "ar-wallet-kit"

import Header from './compontents/header'
import Footer from './compontents/footer'

import Home from './pages/home'
import Bets from './pages/bets'



const App = props => {
  
  return (
    
    <div className='flex flex-col min-h-screen w-full items-center justify-between'>
      <Header/>
      <main className='flex-1 w-full'>
        {props.children}
      </main>
      <Footer/>
    </div>
  )
}
render(() => (
  <WalletProvider config={{
    permissions: [
      "ACCESS_ADDRESS",
      "ACCESS_PUBLIC_KEY",
      "SIGN_TRANSACTION",
      "DISPATCH",
    ],
    ensurePermissions: true,
    strategies: [
      new WanderStrategy(),
      new OthentStrategy()
    ],
  }}>
    <HashRouter root={App}>
      <Route path={["/", "/home"]} component={Home} />
      <Route path="/bets/*" component={Bets} />
    </HashRouter>
  </WalletProvider>
),  document.getElementById('root'))
