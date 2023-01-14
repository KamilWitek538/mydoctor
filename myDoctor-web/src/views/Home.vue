<template>
  <div id="home">
    <b-container fluid>
      <b-row>
        <b-col>
          <b-row>
            <H1>Lekarze</H1>
          </b-row>
          <b-row>
            <b-button block variant="outline-primary" href="doctor">Lista lekarzy</b-button>
          </b-row>
        </b-col>
        <b-col>
          <b-row>
            <H1>Pacjenci</H1>
          </b-row>
          <b-row>
            <b-button block variant="outline-primary" href="pantient">Lista pacjentów</b-button>
          </b-row>
        </b-col>
        <b-col>
          <b-row>
            <H1>Wizyty</H1>
          </b-row>
          <b-row>
            <b-button block variant="outline-primary" href="visit">Lista wizyt</b-button>
          </b-row>
        </b-col>
         <b-col>
          <b-row>
            <H1>Użytkownicy</H1>
          </b-row>
          <b-row>
            <b-button block variant="outline-primary" href="register">Rejestruj użytkownika</b-button>
          </b-row>
        </b-col>
         <b-col>
          <b-row>
            <H1>Harmonogram</H1>
          </b-row>
          <b-row>
            <b-button block variant="outline-primary" href="schedule">Lista harmonogramów</b-button>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "home",
  components: {}
};
</script>
<style scoped>
#home {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.col {
  margin: 10px;
}
.row {
  padding: 5px;
}
</style>

