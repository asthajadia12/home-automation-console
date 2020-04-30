module.exports = (DATA) =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({
                DEVICE_STATE: 'INSTALLED'
            });
        }, 0);
    });
}