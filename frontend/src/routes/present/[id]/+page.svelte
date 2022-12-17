<script>
  import ioClient from "socket.io-client";
  import { onMount } from "svelte";

  // params
  export let data;

  // io init
  const ENDPOINT = "http://5.78.50.153:3000";
  var socket = ioClient(ENDPOINT);
  //state

  var pn = 1;
  var p = "";
  var name = "";
  var room = data.id;

  // next slide
  function next() {
    pn = pn + 1;
    console.log(pn);
    var n = pn;
    socket.emit("go", { n, room });
  }
  // prev. slide
  function back() {
    if (pn - 1 != 0) {
      pn = pn - 1;
      var n = pn;
      socket.emit("go", { n, room });
    }
  }

  // next slide
  function finish() {
    let n = "";
    let user = "";
    socket.emit("seturl", { n, room });
    socket.emit("setp", { user, room });
  }
  onMount(() => {
    //TODO replace w/ localstorage
    var url = localStorage.getItem("link");
    name = localStorage.getItem("usrName");
    // join room
    socket.emit("login", { name, room, url });

    // on load
    socket.on("join", function (n) {
      pn = n;
    });

    socket.on("goto", function (n) {
      pn = n;
    });
    socket.on("setp", function (n) {
      p = n;
    });

    // arrowkey input
    window.addEventListener(
      "keydown",
      (event) => {
        if (event.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }

        switch (event.key) {
          case "Left": // IE/Edge specific value
          case "ArrowLeft":
            // Do something for "left arrow" key press.
            previous();
            break;
          case "Right": // IE/Edge specific value
          case "ArrowRight":
            // Do something for "right arrow" key press.
            next();
            break;
          default:
            return; // Quit when this doesn't handle the key event.
        }

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
      },
      true
    );
  });
</script>

{#if name != p}
  <h4>not presenting</h4>
  <p class="center">
    name: {name}
  </p>
  <div class="centerchild">
    <a class="button" href="/">exit</a>
  </div>
{:else}
  <h1 class="pagecount">{pn}</h1>
  <div class="clickers">
    <button class="clicker" on:click={back}>back</button>
    <button class="clicker" on:click={next}>next</button>
  </div>
  <div class="centerchild">
    <button on:click={finish}>done</button>
    <a class="button" href="/">exit</a>
  </div>
{/if}
