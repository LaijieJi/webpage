<template>
  <div class="instagram-embed">
    <iframe
      :src="`https://www.instagram.com/p/${postId}/embed`"
      frameborder="0"
      allowtransparency="true"
      allow="encrypted-media"
      scrolling="no"
      loading="lazy"
      :title="caption || 'Instagram post'"
    />
  </div>
</template>

<script setup>
defineProps({
  postId: { type: String, required: true },
  caption: { type: String, default: '' }
});
</script>

<style scoped>
.instagram-embed {
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
}

.instagram-embed iframe {
  width: 100%;
  min-height: 600px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}
</style>
