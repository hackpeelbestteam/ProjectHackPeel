<script>
  import { goto } from "$app/navigation";

  let code = "";
  let link = "";
  let name = "";
  let avatar, fileinput;

  function go() {
    if (code !== "" && name !== "") {
      localStorage.setItem("usrName", name);
      localStorage.setItem("link", link);

      if (fileinput.files.length == 0) {
        console.log("Has file!");
      } else {
        console.log("No ");
      }

      goto(`/present/${code}`, { replaceState: false });
    }
  }

  const onFileSelected = (file) => {
    let image = file.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (file) => {
      avatar = file.target.result;
    };
  };
</script>

<h1>clyde.</h1>
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
