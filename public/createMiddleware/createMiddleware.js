//pub sub , 
//Invee di fatch alla cahce devo fare una chiamata al mio server

export const createMiddleware = () => {

    let hold;

    return {
        setData: async (data) => {

            const resp = await fetch("/add", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(data)

            });
            const json = await resp.json();
            return json;
        },
        getData: async () => {
            const resp = await fetch("/get");
            const json = await resp.json();
            return json;
        }
    };
}



