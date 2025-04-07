

export const createTable = ({columns}) => {
   

    const data = [
        { name: 'John Doe', age: 28, country: 'USA', gender: "male" },
        { name: 'Jane Smith', age: 34, country: 'UK', gender: "male" },
        { name: 'Sam Johnson', age: 45, country: 'Canada', gender: "male" },
    ];

    const Table = ()=>{
      return(
        <div class="table w-full">
          <div class="hidden md:table-header-group">
            <div class="table-row">
              <For each={columns}>
                {(col) => <div class="table-cell text-left uppercase text-current/50">{col.title}</div>}
              </For>
            </div>
          </div>
          <div class="table-row-group divide-y lg:divide-y-0 divide-current/10 ">
            <For each={data}>
              {(v) => {
                return(
                  <div class="block lg:table-row hover:bg-base-content/10 rounded-sm">
                    <For each={columns}>
                      {(col) => (
                        <div class="block lg:table-cell" data-label={col.title}>
                          {col.cell(v)}
                        </div>
                      )}
                    </For>
                  </div>
                )
              }}
            </For>
            
          </div>
        </div>
      )
    }

    return { columns, data, Table };
}