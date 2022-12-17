<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let code = "";
  let name = "";

  function go() {
    if (code !== "" && name !== "") 
    {
      localStorage.setItem("usrName", name);
      goto(`/room/${code}`, { replaceState: false });
    }
  }
</script>

<h1>join room</h1>

<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<p style="display:inline">code:</p>
<input style="display:inline" bind:value={code} />
<br>

<p style="display:inline">Name:</p>
<input bind:value={name} />
<br>

<button on:click={go}>go</button>
