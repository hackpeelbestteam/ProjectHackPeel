<script>
  import { goto } from "$app/navigation";
  import { customAlphabet } from "nanoid";

  let nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 6);
  let code = nanoid();

  function go() {
    localStorage.setItem("usrName", "");
    localStorage.setItem("link", "");
    goto(`/room/${code}`, { replaceState: false });
  }
</script>

<head>
  <title>Clide | Home</title>
</head>

<body>
  <div class="section">
    <h1>Clide</h1>
    <h4>The only place you'll ever have to vist when presenting something!</h4>

    <span class="homepage_seporator" />
    <span class="spacer_button_from_seporator" />

    <div class="buttons">
      <a class="button" href="/join">Join</a>
      <button class="button" on:click={go}>Host</button>
    </div>
  </div>
</body>
