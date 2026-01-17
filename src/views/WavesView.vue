<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

// Multiple control points per wave for more organic movement
const wave1 = ref({ p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 })
const wave2 = ref({ p1: 0, p2: 0, p3: 0, p4: 0 })
const wave3 = ref({ p1: 0, p2: 0, p3: 0 })

// Wave 1 - Short wavelength, many oscillations (6 segments)
const wave1Path = computed(() => {
  const w = wave1.value
  return `M0,105
    C${100 + w.p1},${92 + w.p2} ${220 + w.p2},${118 + w.p1} 320,${100 + w.p3}
    C${420 + w.p3},${82 + w.p4} ${540 + w.p4},${115 + w.p2} 640,${98 + w.p1}
    C${740 + w.p2},${80 + w.p5} ${860 + w.p5},${112 + w.p3} 960,${102 + w.p4}
    C${1060 + w.p4},${88 + w.p6} ${1180 + w.p6},${118 + w.p1} 1280,${95 + w.p2}
    C${1380 + w.p1},${78 + w.p3} ${1500 + w.p3},${110 + w.p5} 1600,${100 + w.p6}
    C${1700 + w.p5},${85 + w.p2} ${1820 + w.p2},${115 + w.p4} 1920,${98 + w.p1}
    L1920,150 L0,150 Z`
})

// Wave 2 - Medium wavelength (4 segments)
const wave2Path = computed(() => {
  const w = wave2.value
  return `M0,78
    C${240 + w.p1},${52 + w.p2} ${480 + w.p2},${95 + w.p1} 720,${70 + w.p3}
    C${960 + w.p3},${45 + w.p4} ${1200 + w.p4},${88 + w.p2} 1440,${65 + w.p1}
    C${1680 + w.p2},${42 + w.p3} ${1800 + w.p1},${82 + w.p4} 1920,${72 + w.p2}
    L1920,150 L0,150 Z`
})

// Wave 3 - Long wavelength (3 segments, wide curves)
const wave3Path = computed(() => {
  const w = wave3.value
  return `M0,58
    C${320 + w.p1},${30 + w.p2} ${640 + w.p2},${75 + w.p1} 960,${50 + w.p3}
    C${1280 + w.p3},${25 + w.p1} ${1600 + w.p1},${68 + w.p2} 1920,${55 + w.p3}
    L1920,150 L0,150 Z`
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
        viewBox="0 0 1920 150"
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
  height: calc(100% - 150px);
  position: relative;
}

.waves-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150px;
}

.waves {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
