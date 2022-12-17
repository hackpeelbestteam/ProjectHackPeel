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
  var mn = 1;
  var name = "name";
  var room = data.id;

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
  onMount(() => {
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

    socket.on("setdoc", function (n) {
      var loadingTask = pdfjsLib.getDocument(n);
      // after init
      loadingTask.promise.then(function (pdf) {
        // todo validate page selection
        mn = pdf.numPages;
        socket.emit("mn", { mn, room });

        render(pdf, pn);

        socket.on("goto", function (n) {
          console.log(n);
          pn = n;
          render(pdf, n);
        });
      });
    });

    function render(pdf, pageNumber) {
      pdf.getPage(pageNumber).then(function (page) {
        // temp. hide old canvas to avoid sync issues
        var old = canvas;
        old.style.display = "none";

        // create new canvas
        canvas = document.createElement("canvas");
        canvasdiv.appendChild(canvas);

        var scale = 1.5;
        var viewport = page.getViewport({ scale: scale });

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

<div class="parent">
  <div id="canvas" />
</div>

<button on:click={back}>back</button>
<button on:click={next}>next</button>

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
