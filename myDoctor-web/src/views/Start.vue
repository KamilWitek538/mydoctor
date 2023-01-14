<template>
  <div id="start">
  <b-jumbotron>
    <template slot="header">MyDoctor</template>

    <template slot="lead">
      Aplikacja służąca do obsługi przychodni.
    </template>

    <b-button variant="primary" href="login">Zaloguj</b-button>
  </b-jumbotron>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "start",
  components: {},
};
</script>
<style scoped>
#start {
}
.jumbotron{
  margin-bottom:0px;
}
</style>
