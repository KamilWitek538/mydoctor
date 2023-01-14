<template>
  <div id="user">
    <div>
      <h1>Dodaj użytkownika</h1>
      <div class="inputs">
        <b-form-input placeholder="Podaj login" type="text" class="col-12" v-model="email"></b-form-input>
        <b-form-input placeholder="Podaj hasło" type="password" v-model="password"></b-form-input>
        <b-form-input placeholder="Powtórz hasło" type="password" v-model="repeatPassword"></b-form-input>
      </div>
      <div class="button-container">
        <b-button variant="outline-primary" href="/">Powrót</b-button>
        <b-button variant="primary" @click="register">Rejestruj</b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "user",
  components: {},
  data: () => {
    return {
      email: "",
      password: "",
      repeatPassword: ""
    };
  },
  methods: {
    async register() {
      if (this.email.length === 0) {
        this.$bvToast.toast(`Podaj email.`, {
          title: "Rejestracja użytkownika.",
          autoHideDelay: 5000
        });
        return;
      }
      if (this.password.length === 0) {
        this.$bvToast.toast(`Podaj email.`, {
          title: "Rejestracja użytkownika.",
          autoHideDelay: 5000
        });
        return;
      }
      if (this.repeatPassword.length === 0) {
        this.$bvToast.toast(`Podaj email.`, {
          title: "Rejestracja użytkownika.",
          autoHideDelay: 5000
        });
        return;
      }
      if (this.password !== this.repeatPassword) {
        this.$bvToast.toast(`Hasła się nie zgadzają.`, {
          title: "Rejestracja użytkownika.",
          autoHideDelay: 5000
        });
        return;
      }
      const response = await this.$api.post(`users`, {
        email: this.email,
        password: this.password
      });
      const data = response.data;
      if (data.id) {
        this.$bvToast.toast(`Użytkownik ${this.email} zarejestrowany.`, {
          title: "Rejestracja użytkownika.",
          autoHideDelay: 5000
        });
        this.$router.push("/");
      }
      if (data.error) {
        const error = data.error;
        if (error.original)
          this.$bvToast.toast(error.original.detail, {
            title: "Rejestracja użytkownika.",
            autoHideDelay: 5000,
            appendToast: true
          });
        if (error.errors.length) {
          let description = "";
          description = error.errors.map(error => error.path).join(", ");
          this.$bvToast.toast(`Niepoprawne dane w polach ${description}.`, {
            title: "Rejestracja użytkownika.",
            autoHideDelay: 5000,
            appendToast: true
          });
        }
      }
    }
  }
};
</script>
<style scoped>
#user {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.inputs {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px 0px;
}
.form-control {
  margin: 4px 0px;
}
.button-container {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding-right: 0px;
}
.btn {
  margin-left: 10px;
}
</style>
