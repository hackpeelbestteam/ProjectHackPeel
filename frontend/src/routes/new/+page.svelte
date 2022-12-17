<script>
  import { goto } from "$app/navigation";
  import { nanoid } from "nanoid";

  let code = nanoid(6);
  let name = "";

  function go() {
    if (code !== "" && name !== "") {
      localStorage.setItem("usrName", name);
      localStorage.setItem("link", "");
      goto(`/room/${code}`, { replaceState: false });
    }
  }
</script>

<h1>create room</h1>

<p style="display:inline">Name:</p>
<input bind:value={name} />
<br />

<button on:click={go}>go</button>
