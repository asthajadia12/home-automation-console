module.exports = (ID, ACTION) =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({
                DEVICE_STATE: ACTION
            });
        }, 0);
    });
}