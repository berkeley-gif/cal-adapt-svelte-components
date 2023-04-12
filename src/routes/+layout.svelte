<script>
  import { page } from "$app/stores";
  import { Grid, Row, Column } from "carbon-components-svelte";
</script>

<style lang="scss" global>
  @use "../styles/main";
</style>

<main>
  <Grid padding="{true}">
    <Row>
      <Column>
        <slot />
      </Column>
    </Row>

    {#if $page.url.pathname !== "/"}
      <Row>
        <Column>
          <footer style="margin-top: 10rem">
            <p><a href="/">Go back to the homepage</a></p>
          </footer>
        </Column>
      </Row>
    {/if}
  </Grid>
</main>
