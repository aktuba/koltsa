<script setup>
const emits = defineEmits(['new-game'])
</script>

<template>
  <div class="wrapper">
    <div class="message">
      <div>Game Over</div>
      <div class="btn" @click.stop.prevent="emits('new-game')">New game</div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.8);
}

.message{
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 50px;
  color: white;
  text-align: center;
  transform: translate(-50%,-50%);
  -ms-transform: translate(-50%,-50%);
}

.btn {
  background: linear-gradient(to bottom, #63b8ee 5%, #468ccf 100%);
  background-color: #63b8ee;
  border-radius: 28px;
  display: inline-block;
  cursor: pointer;
  color: #14396a;
  font-size: 17px;
  padding: 1rem 4rem;
  text-decoration: none;
}
.btn:hover {
  background: linear-gradient(to bottom, #468ccf 5%, #63b8ee 100%);
  background-color: #468ccf;
}
.btn:active {
  position: relative;
  top: 1px;
}
</style>
