module.exports = (DATA) =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            console.log('INSTALLING NEW DEVICE');
            resolve({
                DEVICE_STATE: 'INSTALLED'
            });
        }, 0);
    });
}