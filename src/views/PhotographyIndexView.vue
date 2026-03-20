<template>
  <section class="view-section">
    <div class="wrap">
      <header class="hero">
        <div>
          <h1 class="view-heading">Photography</h1>
          <p class="view-text">
            Moments captured through my lens. Each entry tells the story behind the shot.
          </p>
          <br/>
        </div>
      </header>
      <PhotographyList :entries="entries" />
    </div>
  </section>
</template>

<script setup>
import entries from '../data/photography.js';
import PhotographyList from '../components/PhotographyList.vue';
</script>
