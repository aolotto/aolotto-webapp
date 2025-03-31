
import { useApp } from "../../data";

export default props => {

  const {agent} = useApp()
  return (
    <>
    <section className="hero min-w-screen h-[60vh] max-h-[540px]">
      <div className="hero-overlay bg-transparent"></div>
      <div className="hero-content text-center flex flex-col items-center justify-center">
        <h1 className="text-6xl lg:text-7xl block max-w-[960px] text-balance">The $1 on-chain lottery</h1>
        <p>first decentralized lottery protocol on AO.</p>
        {/* <div>
          <div className="text-current/50 text-sm uppercase">Progressive Jackpot</div>
          <div className="text-2xl md:text-4xl text-secondary font-bold">$1,488.91</div>
        </div>
        <div>
          <button role="link" className="btn btn-primary btn-xl rounded-full">Let's bet to WIN</button>
        </div>
        <div>Round-7 , Last bet, higher win rate! </div> */}
      </div>
    </section>
    
    <section className="container">
      <div className=" border-b py-6 px-2 flex flex-col md:flex-row justify-between items-center w-full">
        <div className="flex gap-4 items-center justify-between md:justify-end flex-row md:flex-row-reverse w-full">
          
          <div>
            <div className="text-current/50 uppercase text-sm">Progressive Jackpot</div>
            <div className="text-secondary font-bold text-xl">$2345.00</div>
          </div>
          <div className=" border inline-flex rounded-full text-xl font-bold px-[1em] py-[0.5em]">R7</div>
        </div>
        <div className="">
          <button role="link" className="btn btn-primary btn-xl rounded-full">Let's bet to WIN</button>
        </div>
      </div>
    </section>
    
    </>
  );
}