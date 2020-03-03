const Peer = require("simple-peer");

const socket = io();
const video = document.querySelector("video");
let client = {};

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.mozgetUserMedia ||
  navigator.webkitgetUserMedia;
if (navigator.getUserMedia) {
  navigator.getUserMedia(
    { video: true, audio: true },
    stream => {
      const meida = new MediaStream();
      //   adding peer to client
      socket.emit("permission_success", stream);
      video.srcObject = stream;
      video.play();

      //   initializer
      function InitPeer(type) {
        let peer = new Peer({
          // initator for the client
          initiator: type == "init" ? true : false,
          stream,
          trickle: false
        });
        peer.on("stream", function(stream) {
          // other user append to dom
          videos(stream);
        });
        peer.on("close", () => {
          document.getElementById("other").remove();
          peer.destroy();
        });
        peer.on("data", function(data) {
          let decode = new TextDecoder("utf-8").decode(data);
          // blob object
          let peers = document.getElementById("other");
          peers.style.filter = decde;
          // for the chrome
        });
        return peer;
      }

      // not got a offer
      function MakePeer() {
        //   inital = false
        client.gotAnswer = false;
        let peer = InitPeer("init");
        peer.on("signal", data => {
          console.log(data);
          if (!client.gotAnswer) {
            //   send the offer
            socket.emit("offer", data);
          }
        });
        // got answer and as a part of peer
        client.peer = peer;
      }

      //   get offer
      function ReplytoOffer(offer) {
        let peer = InitPeer("notInit");
        peer.on("signal", data => {
          console.log(data);
          socket.emit("Answer", data);
        });
        peer.signal(offer);
        client.peer = peer;
      }

      function SignalAnswer(answer) {
        client.gotAnswer = true;
        let peer = client.peer;
        peer.signal(answer);
      }

      function videos(stream) {
        let successvideo = document.createElement("video");
        successvideo.srcObject = stream;
        console.log(stream);
        successvideo.classList.add("embed-responsive-item");
        const otherClinet = document.getElementById("other");
        otherClinet.appendChild(successvideo);
        let mat = successvideo.play();
        if (mat != undefined) {
          mat
            .then(function() {
              console.log("playing started");
            })
            .catch(err => {
              alert(err);
            });
        }
      }

      function sessionActive() {
        const h1 = document.createElement("h1");
        h1.textContent = "the session is active with bot";
        document.body.appendChild(h1);
      }
      socket.on("backReply", ReplytoOffer);
      socket.on("backanswer", SignalAnswer);
      socket.on("sessionActive", sessionActive);
      socket.on("makePeer", MakePeer);
    },
    err => {
      console.log(err);
      alert("file is not supported");
    }
  );
}
