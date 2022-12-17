<script>
  import ioClient from "socket.io-client";
  import { onMount } from "svelte";

  // params
  export let data;

  // io init
  const ENDPOINT = "http://localhost:3000";
  var socket = ioClient(ENDPOINT);
  //state

  var pn = 1;
  var p = "";
  var name = "name";
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
    socket.emit("seturl", { n, room });
  }
  onMount(() => {
    var url =
      "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";
    // join room
    socket.emit("login", { name, room, url });

    socket.emit("seturl", { url, room });

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
  {name}, {p}
  <p>not your turn</p>
{:else}
  <h1>{pn}</h1>
  <button on:click={back}>back</button>
  <button on:click={next}>next</button>
  <button on:click={finish}>done</button>
{/if}

<a href="/">home</a>
