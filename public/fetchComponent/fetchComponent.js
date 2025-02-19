//pub sub , 
//Invee di fatch alla cahce devo fare una chiamata al mio server

export const generateFetchComponent = () => {
    let hold;

    return {
        setData: async (data) => {
            console.log(data);
            console.log(JSON.stringify(data))
            fetch("/add", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(data)
                
            })
            .then(r => r.json())
            .then((data) =>  {
                return data.result
            })
            .catch(err => {
                return err.result
            });
        },
        getData: async () => {
            fetch("/get").then(r => r.json()).then(data => {
                let dict = JSON.parse(data.result);
                console.log("si")
                return dict;
            }).catch(err => {
                return err.result
            });
        }
    };
}