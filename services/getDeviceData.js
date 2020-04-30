module.exports = () =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            console.log('GETTING DEVICE DATA');
            resolve({
                DUMMY_DEVICE_DATA: 'DUMMY_DEVICE_DATA'
            })
        }, 0);
    });
}