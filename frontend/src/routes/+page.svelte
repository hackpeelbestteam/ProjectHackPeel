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
  <title>Clide - Home page</title>
</head>

<body>
  <div class="section">
    <h1>clide.</h1>
    <h4>A unified portal to take the pain out of class presentations.</h4>

    <span class="homepage_seporator" />
    <span class="spacer_button_from_seporator" />

    <div class="buttons">
      <a class="button" href="/join">Join</a>
      <button class="button" on:click={go}>Host</button>
    </div>
  </div>

  <div class="centerchild ">
    <div class="bodysection center round-container">
      <h2>How we make life easier.</h2>
      <p>
        At school, we've all been there; presentations are happening and in
        between them, chaos ensues. The flow is disrupted by technical issues,
        presenter movement, and slideshow changing. Teachers are less productive
        and students have to endure presentations for longer periods of time.
        Instead of needing to switch presentations and lean over to hit the next
        button on the keyboard, the process is simple: students open our website
        on their mobile devices and upload their presentations. The teacher
        chooses a presenter and the interface on their device turns into a
        clicker that moves the presentation back or forward. This minimizes the
        time spent transitioning between students and creates a more fluid
        process for everyone.
      </p>
    </div>
  </div>
</body>
