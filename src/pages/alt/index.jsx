export default props => {
  return(
    <main className="container">
    <div class="response_cols py-8">
      <div class="col-start-auto col-span-1 sm:col-span-6 md:col-span-5 lg:col-span-8 flex flex-col gap-4">
        <div class="flex gap-2 items-center">
          <image src="https://arweave.net/3u9Hr7xL02QjVikyY7i3o7ZiRMdoJqr3eQDzT6SOz1s" class="size-12 rounded-full inline-flex"/>
          <span class="text-current/50">$LOTTO</span>
        </div>
        <p class="text-4xl sm:text-5xl lg:text-6xl">          
          The profit-sharing token of the Aolotto ecosystem.
        </p>
      </div>
      <div class="col-start-auto col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex flex-col gap-4">
        <div class="h-12 flex w-fit md:flex-col">
          <span class="text-current/50 md:text-sm">Total Supply:</span> 
          <span>2300.000 $LOTTO</span>
          {/* <span data-tip={toBalanceValue(totalSupply(),tokenInfo()?.[1])}><Show when={totalSupply.state=="ready"&&tokenInfo.state == "ready"} fallback="...">{toBalanceValue(totalSupply(),tokenInfo()?.[1],3)}</Show></span> */}
        </div>
        <p class="text-current/50 ">
          100% launched fairly to the community with a maximum supply of 210,000,000, 10% of the tokens can be obtained via the faucet, the remaining 90% can be earned by betting.
        </p>
        <a class="btn w-fit rounded-full inline-flex items-center btn-primary" href="">Learn more <iconify-icon icon="iconoir:arrow-right"></iconify-icon></a>
      </div>

    </div>
    </main>
  )
}