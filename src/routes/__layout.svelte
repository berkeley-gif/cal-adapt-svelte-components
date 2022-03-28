<script>
  import { Grid, Row, Column } from "carbon-components-svelte";
</script>

<style lang="scss" global>
  @use "../styles/main";
</style>

<Grid padding="{true}">
  <Row>
    <Column>
      <slot />
    </Column>
  </Row>
</Grid>
