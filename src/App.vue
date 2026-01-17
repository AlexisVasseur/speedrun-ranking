<script setup lang="ts">
</script>

<template>
  <router-view />
</template>

<style>
@font-face {
  font-family: 'Iosevka';
  src: url('./fonts/Iosevka/SGr-Iosevka-Bold.ttc') format('truetype');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'IBM Plex Sans';
  src: url('./fonts/IBM_Plex_Sans/static/IBMPlexSans-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'IBM Plex Sans';
  src: url('./fonts/IBM_Plex_Sans/static/IBMPlexSans-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: 'IBM Plex Sans';
  src: url('./fonts/IBM_Plex_Sans/static/IBMPlexSans-SemiBold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
}

@font-face {
  font-family: 'IBM Plex Sans';
  src: url('./fonts/IBM_Plex_Sans/static/IBMPlexSans-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'IBM Plex Sans', sans-serif;
  background: transparent;
}
</style>
