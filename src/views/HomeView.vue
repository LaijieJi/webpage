<template>
  <section class="view-section">
    <div class="wrap">
      <header class="hero">
        <div>
          <h1 class="view-heading">Computer Science student &amp; software developer</h1>
          <p class="view-text">Hi! 👋</p>
          <p class="view-text">
            I'm Laijie Ji, a Computer Engineering student at the Polytechnic University of Valencia. I'm passionate about creating accessible products that solve real problems and make a meaningful impact on people's lives.
          </p>
          <br></br>
          <p class="view-text">
            I enjoy working in multidisciplinary teams where clear communication and transparent documentation help build trustworthy software. Currently expanding my knowledge in Software Development, mobile experiences with Flutter, and Artificial Intelligence.
          </p>
          <br></br>
          <p class="view-text">
            When I am not writing code, I enjoy spending time reading📖, exercising🏃 or learning new things🎒.
          </p>
          <p class="view-text">
            In addition to that, I also spend time doing photography📸 and exploring new places🌍. Click the button to visit my IG account, where I upload the pics I liked.
          </p>
          <br/>
          <a class="button button--accent" href="https://www.instagram.com/laijie.jpg/" target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
        <div>
          <h2>Languages</h2>
          <ul class="inline-list">
            <li>spanish · native</li>
            <li>catalan · advanced</li>
            <li>english · advanced</li>
            <li>chinese · basic</li>
            <li>german · basic</li>
          </ul>
        </div>
      </header>
      <section class="view-section">
        <h2>Contact</h2>
        <p class="view-text">
          let's talk! you can send me an email, follow me on github or connect with me via linkedin
        </p>
        <div class="inline-actions">
          <a class="button button--accent" href="mailto:contact@laijie.dev">email</a>
          <a class="button button--ghost" href="https://github.com/laijieji" target="_blank" rel="noreferrer">
            Github
          </a>
          <a class="button button--ghost" href="https://linkedin.com/in/laijie-ji" target="_blank" rel="noreferrer">
            Linkedin
          </a>
        </div>
      </section>
      <section class="view-section">
        <h2>Experience</h2>
        <ul class="experience-list">
          <li>
            <div class="experience-header">
              <h3>EBHealth3 | Software Developer</h3>
              <span class="experience-dates">Mar. 2024 - Currently</span>
            </div>
            <p class="view-text">
              Backend Development with Spring Boot, AWS and Docker.
              Mobile Apps with Flutter.
            </p>
          </li>
          <li>
            <div class="experience-header">
              <h3>EBHealth3 | Internship</h3>
              <span class="experience-dates">Sept. 2023 - Mar. 2024</span>
            </div>
          </li>
          <li>
            <div class="experience-header">
              <h3>T-Systems | Internship</h3>
              <span class="experience-dates">Feb. 2025 - Aug. 2025</span>
            </div>
            <p class="view-text">DevOps and support for other internal teams.</p>
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
