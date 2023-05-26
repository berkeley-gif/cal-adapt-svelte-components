<script>
  import { page } from "$app/stores";
  import {
    Header,
    HeaderNav,
    HeaderNavItem,
    SkipToContent,
    Content,
    Grid,
    Row,
    Column,
    Button
  } from "carbon-components-svelte";
  import Home from "carbon-icons-svelte/lib/Home.svelte";
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

    {#if $page.url.pathname !== "/"}
      <Row>
        <Column>
          <footer style="margin-top:var(--spacing-96)">
            <Button href="/" icon="{Home}">Go back to the homepage</Button>
          </footer>
        </Column>
      </Row>
    {/if}
  </Grid>
</Content>
