//pub sub , 
//Invee di fatch alla cahce devo fare una chiamata al mio server

export const generateFetchComponent = () => {
    let token;

    return {
        build: (inputToken) => {
            token = inputToken;
        },
        setData: (key, data) => {
            console.log(data);
            return new Promise((resolve, reject) => {
                fetch("/upload", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                     
                    },
                    body: JSON.stringify(data)
                })
                .then(r => r.json())
                .then(data => resolve(data.result))
                .catch(err => reject(err.result));
            });
        },
        getData: (key) => {
            return new Promise((resolve, reject) => {
                fetch("/get")
                .then(r => r.json())
                .then(data => {
                    //let dict = JSON.parse(data.result);
                    resolve(data.result);
                })
                .catch(err => reject(err.result));
            })
        }
    };
}