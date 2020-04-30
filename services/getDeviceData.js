module.exports = () =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({
                DUMMY_DEVICE_DATA: 'DUMMY_DEVICE_DATA'
            })
        }, 0);
    });
}