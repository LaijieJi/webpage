<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <span class="site-footer__note">Let's talk — or send a letter.</span>
      <div class="site-footer__links">
        <a href="mailto:contact@laijie.dev">email</a>
        <a href="https://github.com/LaijieJi" target="_blank" rel="noreferrer">github</a>
        <a href="https://linkedin.com/in/laijie-ji" target="_blank" rel="noreferrer">linkedin</a>
        <a class="is-alt" href="https://www.instagram.com/laijie.jpg/" target="_blank" rel="noreferrer">instagram</a>
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.site-footer {
  border-top: 1px solid var(--line);
  background: var(--veil);
}

.site-footer__inner {
  max-width: 1040px;
  margin: 0 auto;
  padding: 32px 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 18px 32px;
  align-items: center;
  justify-content: space-between;
}

.site-footer__note {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 17px;
  color: var(--muted);
}

.site-footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  font-family: var(--font-mono);
  font-size: 12.5px;
}

.site-footer__links a {
  color: var(--ink);
  border-bottom: 1px solid var(--line);
  padding-bottom: 2px;
}

.site-footer__links a:hover,
.site-footer__links a:focus-visible {
  border-color: var(--accent);
}

.site-footer__links a.is-alt:hover,
.site-footer__links a.is-alt:focus-visible {
  border-color: var(--accent2);
}

@media (max-width: 640px) {
  .site-footer__inner {
    padding: 28px 22px;
  }
}
</style>
