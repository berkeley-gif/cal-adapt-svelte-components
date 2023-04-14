<script>
  import {
    Header,
    HeaderNav,
    HeaderNavItem,
    SkipToContent,
    Content,
    Grid,
    Row,
    Column
  } from "carbon-components-svelte";

  import "../styles/main.scss";
</script>

<Header
  aria-label="Navigation"
  href="{'/'}"
  expandedByDefault="{true}"
  platformName="Cal-Adapt Svelte Components"
>
  <svelte:fragment slot="skip-to-content">
    <SkipToContent />
  </svelte:fragment>

  <HeaderNav>
    <HeaderNavItem href="/about" text="About" />
    <HeaderNavItem
      href="https://github.com/berkeley-gif/cal-adapt-svelte-components"
      target="_blank"
      text="Github Repo"
    />
  </HeaderNav>
</Header>

<Content>
  <Grid>
    <Row>
      <Column>
        <slot />
      </Column>
    </Row>
  </Grid>
</Content>
