<template>
  <section class="view-section">
    <div class="wrap">
      <header class="hero">
        <div>
          <h1 class="view-heading">Projects</h1>
          <p class="view-text">
            A selection of projects where I combine clean architecture, automation, and accessible experiences.
          </p>
        </div>
      </header>
      <div class="card-grid">
        <ProjectCard
          v-for="project in projects"
          :key="project.title"
          v-bind="project"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import projects from '../data/projects.json';
import ProjectCard from '../components/ProjectCard.vue';
</script>
