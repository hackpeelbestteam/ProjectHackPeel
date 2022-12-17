<h1>join room</h1>

<script>

function whenSubmitted()
{
  let form = document.getElementsByName('meetingJoin');

   console.log(form)
}


const form  = document.getElementById('signup');

form.addEventListener('meetingJoin', (event) => {
    console.log("Hello world");
});

</script>

<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation

  <form name="meetingJoin">
    <label>Join Code:</label>
    <input name= "code" type="text"/>
    <input type="submit" value="Join Meeting">
  </form>

<!-- </p> -->
