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

<h1>join room</h1>

<p style="display:inline">code:</p>
<input style="display:inline" bind:value={code} />
<br />

<p style="display:inline">Name:</p>
<input bind:value={name} />
<br />

<p style="display:inline">Presentation:</p>
<input bind:value={link} />
<br />

<button on:click={go}>go</button>
