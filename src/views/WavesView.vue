<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

// Multiple control points per wave for more organic movement
const wave1 = ref({ p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 })
const wave2 = ref({ p1: 0, p2: 0, p3: 0, p4: 0 })
const wave3 = ref({ p1: 0, p2: 0, p3: 0 })

// Wave 1 - Short wavelength, many oscillations (6 segments)
const wave1Path = computed(() => {
  const w = wave1.value
  const baseY = 120
  const amp = 18
  return `M0,${baseY + w.p1}
    Q160,${baseY - amp + w.p2} 320,${baseY + w.p3}
    Q480,${baseY + amp + w.p4} 640,${baseY + w.p1}
    Q800,${baseY - amp + w.p5} 960,${baseY + w.p4}
    Q1120,${baseY + amp + w.p6} 1280,${baseY + w.p2}
    Q1440,${baseY - amp + w.p3} 1600,${baseY + w.p6}
    Q1760,${baseY + amp + w.p2} 1920,${baseY + w.p1}
    L1920,180 L0,180 Z`
})

// Wave 2 - Medium wavelength (4 segments)
const wave2Path = computed(() => {
  const w = wave2.value
  const baseY = 84
  const amp = 24
  return `M0,${baseY + w.p1}
    Q240,${baseY - amp + w.p2} 480,${baseY + w.p3}
    Q720,${baseY + amp + w.p4} 960,${baseY + w.p1}
    Q1200,${baseY - amp + w.p2} 1440,${baseY + w.p4}
    Q1680,${baseY + amp + w.p3} 1920,${baseY + w.p2}
    L1920,180 L0,180 Z`
})

// Wave 3 - Long wavelength (3 segments, wide curves)
const wave3Path = computed(() => {
  const w = wave3.value
  const baseY = 60
  const amp = 30
  return `M0,${baseY + w.p1}
    Q320,${baseY - amp + w.p2} 640,${baseY + w.p3}
    Q960,${baseY + amp + w.p1} 1280,${baseY + w.p2}
    Q1600,${baseY - amp + w.p3} 1920,${baseY + w.p1}
    L1920,180 L0,180 Z`
})

onMounted(() => {
  let startTime = Date.now()

  const animate = () => {
    const t = (Date.now() - startTime) / 1000

    // Wave 1 - Front, faster with short choppy movement
    wave1.value = {
      p1: Math.sin(t * 0.5) * 8 + Math.sin(t * 0.9) * 4,
      p2: Math.sin(t * 0.45 + 1.2) * 7 + Math.cos(t * 0.75) * 5,
      p3: Math.cos(t * 0.55 + 0.8) * 9 + Math.sin(t * 1.0) * 3,
      p4: Math.sin(t * 0.6 + 2.1) * 8 + Math.cos(t * 0.85) * 4,
      p5: Math.cos(t * 0.48 + 1.5) * 10 + Math.sin(t * 0.92) * 5,
      p6: Math.sin(t * 0.52 + 0.3) * 7 + Math.cos(t * 0.78) * 4
    }

    // Wave 2 - Middle, medium sway
    wave2.value = {
      p1: Math.sin(t * 0.3 + 0.5) * 12 + Math.cos(t * 0.5) * 6,
      p2: Math.cos(t * 0.35 + 1.8) * 10 + Math.sin(t * 0.55) * 5,
      p3: Math.sin(t * 0.28 + 2.5) * 14 + Math.cos(t * 0.45) * 7,
      p4: Math.cos(t * 0.32 + 0.3) * 11 + Math.sin(t * 0.6) * 6
    }

    // Wave 3 - Back, slow gentle roll
    wave3.value = {
      p1: Math.cos(t * 0.15 + 1.3) * 15 + Math.sin(t * 0.25) * 8,
      p2: Math.sin(t * 0.18 + 2.2) * 18 + Math.cos(t * 0.28) * 7,
      p3: Math.cos(t * 0.12 + 0.7) * 16 + Math.sin(t * 0.22) * 9
    }

    requestAnimationFrame(animate)
  }

  animate()
})
</script>

<template>
  <div class="waves-view">
    <div class="content">
      <!-- Content area -->
    </div>

    <div class="waves-container">
      <svg
        class="waves"
        viewBox="0 0 1920 180"
        preserveAspectRatio="none"
      >
        <!-- Wave 3 - Darkest, back layer, long wavelength -->
        <path
          :d="wave3Path"
          fill="#134a66"
        />

        <!-- Wave 2 - Medium, medium wavelength -->
        <path
          :d="wave2Path"
          fill="#256d8a"
        />

        <!-- Wave 1 - Lightest, front layer, short wavelength -->
        <path
          :d="wave1Path"
          fill="#4a9bb8"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.waves-view {
  width: 1920px;
  height: 1080px;
  background: #144189;
  position: relative;
  overflow: hidden;
}

.content {
  width: 100%;
  height: calc(100% - 180px);
  position: relative;
}

.waves-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 180px;
}

.waves {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
