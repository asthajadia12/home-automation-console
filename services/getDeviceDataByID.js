module.exports = (ID) =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            console.log('GETTING DEVICE DATA BY SERIAL NUMBER');
            resolve({
                DUMMY_DEVICE_DATA: 'DUMMY_DEVICE_DATA'
            })
        }, 0);
    })
}