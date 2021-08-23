self.onmessage = (message)=>{
    console.log("From worker",message);
    //@ts-ignore
    postMessage({t:"OK"})
}