const myqtt = require("mqtt");
const client = myqtt.connect("mqtt://broker.hivemq.com");
const spawn = require("child_process").spawn;
const process = require("process");


try {

    let state = "";

    client.on("connect", () => {
        client.subscribe("bot/stop");
        client.subscribe("bot/left");
        client.subscribe("bot/right");
        client.subscribe("bot/down");
        client.subscribe("bot/up");
        client.subscribe("bot/disconnect");

        //   sending back request of confiremation
        client.publish("bit/connected", "true");
        client.publish("but/state", 'true');
    });

    client.on("message", (topic, message) => {
        console.log(message);
        switch (topic) {
            // send low level request
            case "bot/left":
                console.log(message);

                return handleLeft(message);
            case "bot/right":
                return handleRight(message);

            case "bot/up":
                return handleUp(message);

            case "bot/down":
                return handleDown(message);

            case "bot/stop":
                return handleStop(message);
        }
    });

    function handleLeft(message) {
        try {
            if (state != "left") {
                console.log("moving left");
                state = "left";
                client.publish("bot/saate", state);
            } else {
                throw new Error("cannot move again");
            }
        } catch (err) {
            console.log(err);
        }
    }

    function handleRight(message) {
        try {
            if (state != "right") {
                console.log("moving right");
                state = "right";
                client.publish("bot/saate", state);
            } else {
                throw new Error("cannot move right again");
            }
        } catch (err) {
            console.log(err);
        }
    }

    function handleUp(message) {
        try {
            if (state != "up") {
                console.log("moving up");
                state = "up";
                client.publish("bot/saate", state);
            } else {
                throw new Error("cannot up  move again");
            }
        } catch (err) {
            console.log(err);
        }
    }

    function handleDown(message) {
        try {
            if (state != "down") {
                console.log("moving down");
                state = "down";
                client.publish("bot/saate", state);
            } else {
                throw new Error("cannot  doen move again");
            }
        } catch (err) {
            console.log(err);
        }
    }

    function handleStop(message) {
        try {
            if (state != "stop") {
                console.log("moving stop");
                state = "up";
                client.publish("bot/saate", state);
            } else {
                throw new Error("cannot stop again");
            }
        } catch (err) {
            console.log(err);
        }
    }

    function handleAppExit(options, err) {
        if (err) {
            console.log(err.stack);
        }

        if (options.cleanup) {
            client.publish("garage/connected", "false");
        }

        if (options.exit) {
            process.exit();
        }
    }

    function handleAppExit(options, err) {
        if (err) {
            console.log(err.stack);
        }

        if (options.cleanup) {
            client.publish("garage/connected", "false");
        }

        if (options.exit) {
            process.exit();
        }
    }
} catch (err) {
    console.log(err);
}


process.on(
    "exit",
    handleAppExit.bind(null, {
        cleanup: true
    })
);
process.on(
    "SIGINT",
    handleAppExit.bind(null, {
        exit: true
    })
);
process.on(
    "uncaughtException",
    handleAppExit.bind(null, {
        exit: true
    })
);