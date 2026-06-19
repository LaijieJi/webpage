<template>
  <picture class="rimg" :class="{ 'rimg--fill': fill }">
    <source v-if="webp" :srcset="webp" :sizes="sizes || undefined" type="image/webp" />
    <img
      :src="src"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      :style="imgStyle"
    />
  </picture>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  src: { type: String, required: true }, // JPEG fallback
  webp: { type: String, default: '' }, // WebP srcset
  sizes: { type: String, default: '' },
  alt: { type: String, default: '' },
  ratio: { type: String, default: '' }, // e.g. "1 / 1"
  cover: { type: Boolean, default: false },
  fill: { type: Boolean, default: false },
  eager: { type: Boolean, default: false }
});

const imgStyle = computed(() => {
  const style = {};
  if (props.ratio) style.aspectRatio = props.ratio;
  if (props.cover || props.fill) style.objectFit = 'cover';
  return style;
});
</script>

<style scoped>
.rimg,
.rimg img {
  display: block;
  width: 100%;
}

.rimg--fill,
.rimg--fill img {
  height: 100%;
}
</style>
