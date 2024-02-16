/**
 * @param {number} millis
 * @return {Promise}
 */
millis=100
let t = Date.now();
sleep(100).then(() => {
  console.log(Date.now() - t); // 100
});
async function sleep(millis) {
    const prom= new Promise((req,res)=>{
        if(millis==100){
            res;
            return millis
        }
    })
    
}

/** 
 * let t = Date.now()
 * sleep(100).then(() => console.log(Date.now() - t)) // 100
 */