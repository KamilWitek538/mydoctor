<template>
  <div id="app">
    <b-navbar type="dark">
      <b-navbar-brand :href="isLogged?'/home':'/'">MyDoctor</b-navbar-brand>
      <b-button @click="logout" v-if="isLogged">Wyloguj</b-button>
    </b-navbar>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "app",
  computed: mapGetters(["isLogged"]),
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  },
  created() {
    const name = this.$router.history.current.name;
    if ((name === "start" || name === "login") && this.isLogged !== null) {
      this.$router.push("/home");
    }
    if (name === "start" || name === "404" || name === "login") return;

    if (!this.isLogged) {
      this.$router.push("/404");
    }
  }
};
</script>
<style>
#app {
}
.footer {
  padding: 20px;
  display: flex;
  justify-content: center;
  color: white;
  background-color: #18a2b8;
}
.navbar {
  background: #18a2b8;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
button {
  margin-right: 10px;
}
</style>
