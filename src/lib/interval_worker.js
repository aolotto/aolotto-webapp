const WorkerCode = () => {
  const _self = self;
  setInterval(() => {
      _self.postMessage(Date.now());
  }, 1000);
};

let code = WorkerCode.toString();

code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });

const time_worker = URL.createObjectURL(blob);

export default time_worker
