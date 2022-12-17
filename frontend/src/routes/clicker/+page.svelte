<script>
    export let type = "primary";
    export let flat = false;
    export let inverse = false;
</script>

<button class = {type}>
    <slot></slot>
</button>

<style>
    button {
        border: 4px;
        color: black;
        padding: 8px 8px;
        text-align: center;
        text-decoration: solid;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        border-radius: 8px;
    }

</style>