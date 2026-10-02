<template>
  <!-- The lj mark: Newsreader's l and j as one shape, the j's dot in the accent.
       Masters and icon sources are in /brand. -->
  <svg class="brand-mark" viewBox="-21.65 0 43.30 100" aria-hidden="true" focusable="false">
    <path class="brand-mark__letters" d="M-0.57 73.18 6.05 74.78V76.24H-19.82V74.78L-13.2 73.18V10.61Q-13.86 10.21 -15.06 9.51Q-16.26 8.81 -17.91 7.84Q-19.55 6.87 -21.55 5.67V4.56L-1.06 -0.02H-0.57V9.46Z M9.52 33.81Q8.95 33.36 7.92 32.58Q6.88 31.81 5.52 30.77Q4.16 29.72 2.57 28.5V27.39L21.65 22.13H22.15V32.42V71.84Q22.15 75.07 21.85 77.48Q21.55 79.89 20.53 82.05Q19.52 84.21 17.33 86.64Q15.15 89.07 11.46 92.25Q7.77 95.43 2.09 99.98L1.04 98.93Q4.12 95.28 5.84 92.86Q7.56 90.44 8.34 88.33Q9.11 86.23 9.31 83.64Q9.52 81.05 9.52 77.1Z" />
    <circle class="brand-mark__dot" cx="14.97" cy="8.05" r="7.35" />
  </svg>
</template>

<style scoped>
.brand-mark {
  display: block;
  height: 100%;
  width: auto;
  overflow: visible;
}

.brand-mark__letters {
  fill: currentColor;
}

.brand-mark__dot {
  fill: var(--accent);
}
</style>
