module.exports = (ID, ACTION) =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            console.log('UNINSTALL A DEVICE');
            resolve({
                DEVICE_STATE: ACTION
            });
        }, 0);
    });
}