<template>
  <section class="view-section">
    <div class="wrap">
      <header class="hero">
        <div>
          <h1 class="view-heading">Computer Science student &amp; software developer</h1>
          <p class="view-text">Hola! 👋</p>
          <p class="view-text">
            I'm Laijie Ji, a Computer Engineering student at the Polytechnic University of Valencia. I'm passionate about creating accessible products that solve real problems and make a meaningful impact on peopl'es lives.
          </p>
          <br></br>
          <p class="view-text">
            I enjoy working in multidisciplinary teams where clear communication and transparent documentation help build trustworthy software. Currently expanding my knowledge in Software Development, mobile experiences with Flutter, and Artificial Intelligence..
          </p>
          <br></br>
          <p class="view-text">
            Cuando no estoy programando, me gusta invertir mi tiempo leyendo📖, haciendo ejercicio🏃 o aprendiendo🎒.
          </p>
        </div>
        <div>
          <h2>Idiomas</h2>
          <ul class="inline-list">
            <li>Spanish · Native</li>
            <li>Catalan · Advanced</li>
            <li>English · Advanced</li>
            <li>Chinese · Basic</li>
            <li>German · Basic</li>
          </ul>
        </div>
      </header>
      <section class="view-section">
        <h2>Contacto</h2>
        <p class="view-text">
          ¿Hablamos? Puedes escribirme un correo, seguir mi trabajo en GitHub o conectar por LinkedIn.
        </p>
        <div class="inline-actions">
          <a class="button button--accent" href="mailto:ji.laijie@gmail.com">Email</a>
          <a class="button button--ghost" href="https://github.com/LaijieJi" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a class="button button--ghost" href="https://linkedin.com/in/laijie-ji" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </section>
      <section class="view-section">
        <h2>Experiencie</h2>
        <ul class="experience-list">
          <li>
            <div class="experience-header">
              <h3>EBHealth3 · Software Developer</h3>
              <span class="experience-dates">Mar. 2024 – Currently</span>
            </div>
            <p class="view-text">
              Desarrollo backend con Spring Boot, AWS y Docker; aplicaciones móviles con Flutter.
              Backend Dev with Sring Boot, AWS, Docekr. And also mobile
            </p>
          </li>
          <li>
            <div class="experience-header">
              <h3>EBHealth3 · Internship</h3>
              <span class="experience-dates">Sept. 2023 – Mar. 2024</span>
            </div>
          </li>
          <li>
            <div class="experience-header">
              <h3>T-Systems · Internship</h3>
              <span class="experience-dates">Feb. 2025 – Aug. 2025</span>
            </div>
            <p class="view-text">DevOps y soporte  para equipos internos.</p>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>

<style scoped>
.inline-actions {
  margin-top: var(--space-lg);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.experience-list {
  margin: var(--space-xl) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--space-lg);
}

.experience-header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: baseline;
  justify-content: space-between;
}

.experience-dates {
  color: var(--muted);
  font-size: 0.95rem;
}
</style>
