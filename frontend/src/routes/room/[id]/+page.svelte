<script>
  import ioClient from "socket.io-client";
  import { onMount } from "svelte";
  import QRCode from "./qr.svelte";

  // params
  export let data;

  // io init
  const ENDPOINT = "http://5.78.50.153:3000";
  var socket = ioClient(ENDPOINT);
  //state

  var pn = 1;
  var mn = 1;
  //TODO replace w/ localstorage
  var name = "";
  var p = "";
  var host = "";
  var room = data.id;
  var url = "";
  var users = [];

  // next slide
  function next() {
    if (pn != mn) {
      pn = pn + 1;
      console.log(pn);
      var n = pn;
      socket.emit("go", { n, room });
    }
  }
  // prev. slide
  function back() {
    if (pn - 1 != 0) {
      pn = pn - 1;
      var n = pn;
      socket.emit("go", { n, room });
    }
  }
  function finish() {
    let n = "";
    let user = "";
    socket.emit("seturl", { n, room });
    socket.emit("setp", { user, room });
    p = "";
    canvas.style.display = "none";
  }
  function exit() {
    console.log("exit");
  }
  // prev. slide
  function setuser(user) {
    socket.emit("setp", { user, room });
    canvas.style.display = "block";
  }
  onMount(() => {
    name = localStorage.getItem("usrName");
    var canvasdiv = document.getElementById("canvas");
    // init canvas
    var canvas = document.createElement("canvas");
    canvasdiv.appendChild(canvas);

    // join room
    socket.emit("login", { name, room });

    // on load
    socket.on("join", function (n) {
      console.log("joined " + n);
      pn = n;
    });

    socket.on("sethost", function (n) {
      host = n;
    });

    socket.on("setp", function (n) {
      p = n;
    });
    socket.on("updateusers", function (u) {
      console.log("users " + u);
      users = u;
    });

    socket.on("seturl", function (n) {
      url = n;
      if (url == null || url == "") {
        canvas.remove();
      } else {
        var loadingTask = pdfjsLib.getDocument(n);
        // after init
        loadingTask.promise.then(function (pdf) {
          // todo validate page selection
          mn = pdf.numPages;

          render(pdf, pn);

          socket.on("goto", function (n) {
            console.log(n);
            pn = n;
            render(pdf, n);
          });
        });
      }
    });

    function render(pdf, pageNumber) {
      pdf.getPage(pageNumber).then(function (page) {
        // temp. hide old canvas to avoid sync issues
        var old = canvas;
        old.style.display = "none";

        // create new canvas
        canvas = document.createElement("canvas");
        canvasdiv.appendChild(canvas);

        var windowHeight = window.innerHeight;
        var windowWidth = window.innerWidth;
        var viewport = page.getViewport({ scale: 1 });
        var scaleH = windowHeight / viewport.height;
        var scaleW = windowWidth / viewport.width;
        var scale = Math.min(scaleH, scaleW);

        // console.log(temp + "Window");
        // console.log(viewport.width + "PDF");
        // console.log(scale + "Scale");

        var viewport = page.getViewport({ scale: scale });
        // var viewport = page.getViewport(canvas.width / page.getViewport(1.0).width);
        // Prepare canvas using PDF page dimensions
        var context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        var renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
          old.remove();
        });
      });
    }

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

{#if (url != null && url != "") || p != ""}
  <button class="hostbutton" on:click={back}>back</button>
  <button class="hostbutton" on:click={next}>next</button>
  <button class="hostbutton" on:click={finish}>done</button>
{:else}
  <button class="hostbutton" on:click={exit}>❌ close room</button>
  <p class="center">join with code</p>
  <h1 class="roomcode center">{room}</h1>
  <div class="centerchild">
    <QRCode codeValue="http://5.78.50.153:5173/join" squareSize="150" />
  </div>
  <h4 class="center">select a presenter</h4>
  <div class="centerchild">
    <div class="seldiv">
      {#each users as user}
        {#if user != name}
          <button class="userbutton" on:click={setuser(user)}>{user}</button>
        {/if}
      {/each}
    </div>
  </div>
{/if}

<div class="parent">
  <div id="canvas" />
</div>

<style>
  canvas {
    width: auto;
    height: auto;
    max-width: 90%;
    max-height: 90%;
  }
  .parent {
    z-index: -1;
    display: flex;
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
</style>
