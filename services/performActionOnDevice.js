module.exports = (ID, ACTION) =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            console.log('PERFORM ACTION ON DEVICE');
            resolve({
                DEVICE_STATE: ACTION
            });
        }, 0);
    });
}