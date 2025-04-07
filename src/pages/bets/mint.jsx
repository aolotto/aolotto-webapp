import Mintlevel from "../../compontents/mintlevel"
import { Icon } from '@iconify-icon/solid'
export default props => {
  return (
    <section className="response_cols overflow-visible border-y border-current/20">
      <div className="col-span-full md:col-span-6 lg:col-span-7">1</div>
      <div className="col-span-full md:col-span-4 lg:col-start-9 py-4">
        <ul className="flex flex-col gap-2">
        <li class="text-xs md:text-sm text-current/50 flex items-center gap-2">
          <span className="tooltip tooltip-bottom" data-tip="1 $ALT = 1 $ALT">
            <Mintlevel level={4} />
          </span>
          <span>
            bet <span class="text-base-content">$100</span> <Icon icon="iconoir:arrow-right" class="text-current/50"/> <span class="text-base-content">~ 16,818.288</span> $ALT
          </span>
        </li>
        <li class="text-xs md:text-sm text-current/50 flex items-center gap-2">
          <span className="tooltip tooltip-bottom" data-tip="1 $ALT = 1 $ALT">
            <Mintlevel level={3} />
          </span>
          <span>
            bet <span class="text-base-content">$50-99</span> <Icon icon="iconoir:arrow-right" class="text-current/50"/> <span class="text-base-content">~ 5,045.487-9,990.063</span> $ALT
          </span>
        </li>
        <li class="text-xs md:text-sm text-current/50 flex items-center gap-2">
          <span className="tooltip tooltip-bottom" data-tip="1 $ALT = 1 $ALT">
            <Mintlevel level={2} />
          </span>
          <span>
            bet <span class="text-base-content">$10-49</span> <Icon icon="iconoir:arrow-right" class="text-current/50"/> <span class="text-base-content">~ 504.549-2,472.288</span> $ALT
          </span>
        </li>
        <li class="text-xs md:text-sm text-current/50 flex items-center gap-2">
          <span className="tooltip tooltip-bottom" data-tip="1 $ALT = 1 $ALT">
            <Mintlevel level={1} />
          </span>
          <span>
            bet <span class="text-base-content">$1-9</span> <Icon icon="iconoir:arrow-right" class="text-current/50"/> <span class="text-base-content">~ 16.818-151.365</span> $ALT
          </span>
        </li>
        </ul>
      </div>
    </section>
  )
}