<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let code = "";
  function go() {
    goto(`/room/${code}`, { replaceState: false });
  }
</script>

<h1>join room</h1>

<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
<p>code:</p>
<input bind:value={code} />
<button on:click={go}>go</button>
