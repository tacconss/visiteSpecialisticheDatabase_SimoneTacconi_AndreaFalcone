const createPubSub = () => {
    const dict = {};
    return {
        subscribe: (eventName, callback) => {
            if (!dict[eventName]) {
                dict[eventName] = [];
            }
            dict[eventName].push(callback);
        },
        publish: (eventName) => {
            dict[eventName].forEach((callback) => callback());
        }
    }
}

/**
 * Aspetta l'evento (perchè lo sto creando) subscribe (riceve)
 * Dice a tutti che è stato eseguito l'evento (invia)
 */