import { Icon } from "@iconify-icon/solid"
export default props => {
  const links = [{
    label: "github",
    url:"https://github.com/aolotto/aolotto"
  },{
    label: "twitter",
    url:"https://x.com/aolotto_dao"
  },{
    label: "discord",
    url:"https://discord.com/invite/BFhkUCRjmF"
  }]

  return(
    <footer class="flex w-full justify-between h-16 items-center px-4 flex-col md:flex-row">
      <div class="text-base-content/40 text-sm flex items-center gap-2">
        <span>ar://aolotto</span>
        <span>- Running permanently on</span>
        <a href="https://ao.arweave.dev/" target="_blank">
          <img class="size-4 opacity-50" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTEuOTciIHZpZXdCb3g9IjAgMCA0MjkgMjE0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCAyMTRINzEuMzc2M0w4NS45NDI5IDE3NC42MUw1My4xNjgxIDEwNy41TDAgMjE0WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTE4OS4zNjYgMTYwLjc1TDEwOS45NzggMUw4NS45NDI5IDU1LjcwODlMMTYwLjk2MSAyMTRIMjE1TDE4OS4zNjYgMTYwLjc1WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zMjIgMjE0QzM4MS4wOTQgMjE0IDQyOSAxNjYuMDk0IDQyOSAxMDdDNDI5IDQ3LjkwNTUgMzgxLjA5NCAwIDMyMiAwQzI2Mi45MDYgMCAyMTUgNDcuOTA1NSAyMTUgMTA3QzIxNSAxNjYuMDk0IDI2Mi45MDYgMjE0IDMyMiAyMTRaTTMyMiAxNzJDMzU3Ljg5OSAxNzIgMzg3IDE0Mi44OTkgMzg3IDEwN0MzODcgNzEuMTAxNSAzNTcuODk5IDQyIDMyMiA0MkMyODYuMTAxIDQyIDI1NyA3MS4xMDE1IDI1NyAxMDdDMjU3IDE0Mi44OTkgMjg2LjEwMSAxNzIgMzIyIDE3MloiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPg=="></img>
        </a>
      </div>
      <div class="">
        <ul class="flex justify-end gap-4">
          {links.map((item)=><li><a href={item.url}><Icon icon={`carbon:logo-${item.label}`} /></a></li>)}
        </ul>
      </div>
    </footer>
  )
}




