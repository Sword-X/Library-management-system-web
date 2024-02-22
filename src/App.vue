<template>
  <div id="app">
    <!-- <el-button type="text">文字按钮111</el-button>
    <el-button type="text" disabled>文字按钮</el-button>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/login">login</router-link>
    </nav> -->
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
