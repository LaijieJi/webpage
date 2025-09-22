<template>
  <section class="view-section">
    <div class="wrap">
      <header class="hero">
        <div>
          <h1 class="view-heading">Computer Science student &amp; software developer</h1>
          <p class="view-text">
            Soy Laijie Ji, estudiante de Computer Science en la Universidad Politécnica de València. Me apasiona crear productos digitales accesibles y sostenibles que resuelvan problemas reales.
          </p>
          <p class="view-text">
            Disfruto trabajando en equipos multidisciplinares donde la comunicación clara y la documentación transparente ayudan a construir software confiable. Actualmente exploro patrones de DevOps, experiencias móviles con Flutter y APIs diseñadas con intención.
          </p>
          <p class="view-text">
            Cuando no estoy programando, organizo talleres, comparto recursos con comunidades estudiantiles y aprendo de otras personas constructoras.
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
        <h2>Experiencia</h2>
        <ul class="experience-list">
          <li>
            <div class="experience-header">
              <h3>EBHealth3 · Software Developer</h3>
              <span class="experience-dates">Mar. 2024 – Actualidad</span>
            </div>
            <p class="view-text">
              Desarrollo backend con Spring Boot, AWS y Docker; aplicaciones móviles con Flutter.
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
            <p class="view-text">DevOps y soporte para equipos internos.</p>
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
