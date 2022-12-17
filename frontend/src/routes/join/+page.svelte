<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let code = "";
  let link =
    "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";
  let name = "";
  let avatar, fileinput;


  function go() {
    if (code !== "" && name !== "") {
      localStorage.setItem("usrName", name);
      localStorage.setItem("link", link);
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


<div class="chan" on:click={()=>{fileinput.click();}}>Choose Image</div>
<input
  style="display:none"
  type="file"
  accept=".pdf"
  on:change={(file) => onFileSelected(file)}
  bind:this={fileinput}
/>

<button on:click={go}>go</button>
