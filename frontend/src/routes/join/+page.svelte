<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let code = "";
  let link =
    "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";
  let name = "";

  function go() {
    if (code !== "" && name !== "") {
      localStorage.setItem("usrName", name);
      localStorage.setItem("link", link);
      goto(`/present/${code}`, { replaceState: false });
    }
  }
</script>

<h1>join room</h1>

<p style="display:inline">code:</p>
<input style="display:inline" bind:value={code} />
<br />

<p style="display:inline">Name:</p>
<input bind:value={name} />
<br />

<button on:click={go}>go</button>
