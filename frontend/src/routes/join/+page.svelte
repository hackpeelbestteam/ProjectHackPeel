<script>
  import { goto } from "$app/navigation";

  let code = "";
  let link = "http://5.78.50.153:3000/static/pitch.pdf";
  let name = "";

  function go() {
    if (code !== "" && name !== "") {
      localStorage.setItem("usrName", name);
      localStorage.setItem("link", link);
      goto(`/present/${code}`, { replaceState: false });
    }
  }
</script>

<title>clide. | connect</title>

<h1>clide.</h1>
<h2 class="center">join room</h2>
<div class="inputs">
  <input bind:value={code} placeholder="room code" />
  <br />

  <input bind:value={name} placeholder="username" />
  <br />

  <input bind:value={link} placeholder="presentation link" />
  <br />

  <button class="button" on:click={go}>go</button>
  <a href="/">or create one</a>
</div>
