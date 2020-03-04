const myqtt = require("mqtt");
try {
    const client = myqtt.connect("mqtt://soilder.cloudmqtt.com");

    const connected = false;
    const state = "";
    const motion_moves = ["left", "right", "up", "down", "stop"];
    const errors = {};

    // init the connection
    client.on("connect", () => {
        client.subscribe("bot/connected", 'true');
        client.subscribe("bot/state");
    });

    client.on("message", (topic, message) => {
        // assume message and topic mboth to be utf-8
        switch (topic) {
            case "connected":
                let status = message;
                return botConnected(status);

            case motion_moves[0]:
                return botLeftMove(message);
            case motion_moves[1]:
                return botRighttMove(message);
            case motion_moves[2]:
                return botUpMove(message);
            case motion_moves[3]:
                return botDownMove(message);
            case motion_moves[4]:
                return botStop(message);
        }
    });

    const botStop = message => {
        if (connected) {
            state = "stop";
            if (motion_moves.includes(message)) {
                client.publish("bot/stop", 'true');
            }
        }
    };


    // first initiater of the step in process
    const botConnected = status => {
        console.log(message);
        connected = message ? 'true' : false;
    };

    const botLeftMove = message => {
        console.log(message);
        if (connected == 'true') {
            state = "left";
            // publish now
            if (message) {
                client.publish("bot/left", 'true');
            }
        }
    };

    const botRighttMove = message => {
        console.log(message);
        if (connected == 'true') {
            state = "right";
            // publish now
            if (message) {
                client.publish("bot/right", 'true');
            }
        }
    };

    const botDownMove = message => {
        console.log(message);
        if (connected == 'true') {
            state = "down";
            // publish now
            if (message) {
                client.publish("bot/down", 'true');
            }
        }
    };

    const botUpMove = message => {
        console.log(message);
        if (connected == 'true') {
            state = "Up";
            // publish now
            if (message) {
                client.publish("bot/left", 'true');
            }
        }
    };
    console.log(client);

} catch (err) {
    console.log('error conneting');
}