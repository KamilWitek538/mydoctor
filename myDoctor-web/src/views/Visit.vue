<template>
  <div id="visit">
    <h1>Wizyty</h1>
    <div class="searchBar">
      <b-button variant="primary" :disabled="!!selected" @click="add">Dodaj</b-button>
      <b-button variant="secondary" :disabled="!selected" @click="edit">Edytuj</b-button>
      <b-button variant="danger" :disabled="!selected" @click="remove">Usuń</b-button>
    </div>
    <!-- <div class="searchBar">
      <b-form-select v-model="selectedDoctor" :options="filterDoctors" class="col-3"></b-form-select>
      <b-form-input v-model="selectedDate" type="date" class="col-3"></b-form-input>
      <b-form-select v-model="selectedPantient" :options="filterPantients" class="col-3"></b-form-select>
    </div>-->
    <b-table
      ref="table"
      selectable
      select-mode="single"
      @row-selected="select"
      striped
      hover
      small
      fixed
      :items="items"
      :fields="fields"
    >
      <template slot="date" slot-scope="data">{{ getDate(data.item.date) }}</template>
    </b-table>
    <b-pagination
      v-model="page"
      :total-rows="totalPage"
      per-page="1"
      class="my-0"
      @change="changePage"
    ></b-pagination>
    <b-modal
      ref="edit"
      :title="selected !== null ? 'Edycja wizyty':'Dodaj wizytę'"
      centered
      @ok="ok"
      @cancel="cancel"
    >
      <b-form-input
        list="doctors"
        v-model="editDoctor"
        placeholder="Wybierz lekarza"
        @change="changeDoctor"
      ></b-form-input>
      <datalist id="doctors">
        <option
          v-for="doctor in doctors"
          v-bind:key="doctor.id"
        >{{ doctor.firstname + ' '+doctor.lastname}}</option>
      </datalist>
      <b-form-input list="pantients" v-model="editPantient" placeholder="Wybierz pacjenta"></b-form-input>
      <datalist id="pantients">
        <option
          v-for="pantient in pantients"
          v-bind:key="pantient.id"
        >{{ pantient.firstname + ' '+pantient.lastname}}</option>
      </datalist>
      <b-form-input list="dates" v-model="editDate" placeholder="Wybierz datę" @change="changeDate"></b-form-input>
      <datalist id="dates">
        <option v-for="day in freeDay" v-bind:key="day">{{ day }}</option>
      </datalist>
      <b-form-input
        list="hours"
        v-model="editTime"
        placeholder="Wybierz godzinę"
        @change="changeHour"
      ></b-form-input>
      <datalist id="hours">
        <option v-for="hour in freeHour" v-bind:key="hour">{{ hour }}</option>
      </datalist>
      <b-form-input v-model="editDescription" placeholder="Podaj opis" type="text"></b-form-input>
    </b-modal>
  </div>
</template>


<script>
import moment from "moment";
export default {
  name: "visit",
  components: {},
  computed: {
    selectedDoctor() {
      let item = null;
      if (this.editDoctor) {
        const split = this.editDoctor.split(" ");
        const firstname = split[0];
        const lastname = split[1];
        item = this.doctors.find(
          item => item.firstname === firstname && item.lastname === lastname
        );
      }
      return item;
    },
    selectedPantient() {
      let item = null;
      if (this.editPantient) {
        const split = this.editPantient.split(" ");
        const firstname = split[0];
        const lastname = split[1];
        item = this.pantients.find(
          item => item.firstname === firstname && item.lastname === lastname
        );
      }
      return item;
    }
  },
  data: () => {
    return {
      fields: {
        doctor: {
          label: "Doktor",
          sortable: true
        },
        date: {
          label: "Godzina i data wizyty",
          sortable: true
        },
        pantient: {
          label: "Nazwisko i imię pacjenta",
          sortable: true
        },
        description: {
          label: "Opis"
        }
      },
      items: [],
      editDoctor: null,
      editPantient: null,
      editDescription: "",
      editDate: null,
      editTime: null,
      selected: null,
      page: 1,
      totalPage: 3,
      pantients: [],
      doctors: [],
      freeDate: [],
      freeDay: [],
      freeHour: []
    };
  },
  methods: {
    getDate(date) {
      return moment(date).format("HH:mm DD-MM-YYYY");
    },
    select(items) {
      this.selected = items[0];
    },
    remove() {
      const { doctor, pantient, date, id } = this.selected;
      this.$bvModal
        .msgBoxConfirm(
          `Czy chcesz usunąć wizytę ${pantient} u ${doctor} ${moment(
            date
          ).format("HH:mm DD.MM.YYYY")} ?`,
          {
            title: "Usuwanie wizyty",
            size: "sm",
            buttonSize: "sm",
            okVariant: "secondary",
            cancelVariant: "primary",
            okTitle: "Usuń",
            cancelTitle: "Nie",
            footerClass: "p-2",
            hideHeaderClose: true,
            centered: true
          }
        )
        .then(async () => {
          const response = await this.$api.delete(`visit/remove/${id}`);
          const data = response.data;
          if (data.item) {
            this.$bvToast.toast("Usunięto dane.", {
              title: "Usuwanie wizyty.",
              autoHideDelay: 5000
            });
          }
          if (data.error) {
            const error = data.error;
            if (error.original)
              this.$bvToast.toast(error.original.detail, {
                title: "Usuwanie wizyty.",
                autoHideDelay: 5000,
                appendToast: true
              });
            if (error.errors.length) {
              let description = "";
              description = error.errors.map(error => error.path).join(", ");
              this.$bvToast.toast(`Niepoprawne dane w polach ${description}.`, {
                title: "Usuwanie wizyty.",
                autoHideDelay: 5000,
                appendToast: true
              });
            }
          }
          this.loadVisit();
        })
        .catch(error => {
          console.log(error);
        });
    },
    edit() {
      const { doctor, pantient, date, description } = this.selected;
      this.editDoctor = doctor;
      this.editPantient = pantient;
      this.loadFreeDays(this.selectedDoctor.id);
      this.editDate = moment(date).format("DD.MM.YYYY");
      this.editTime = moment(date).format("HH:mm");
      this.editDescription = description;
      this.$refs["edit"].show();
    },
    add() {
      this.$refs["edit"].show();
    },
    cancel() {
      this.selected = null;
      this.editDoctor = null;
      this.editPantient = null;
      this.editDate = null;
      this.editTime = null;
      this.editDescription = "";
      this.$refs.table.clearSelected();
    },
    async ok() {
      let change = false;
       const date = moment.utc(this.editDate + " " + this.editTime, "DD-MM-YYYY HH:mm").toDate();
      if (this.selected) {
        const response = await this.$api.post(`visit/edit`, {
          id: this.selected.id,
          doctorId: this.selectedDoctor.id,
          pantientId: this.selectedPantient.id,
          date,
          description: this.editDescription
        });
        const data = response.data;
        if (data.item) {
          this.$bvToast.toast("Zmieniono dane.", {
            title: "Edycja wizyty.",
            autoHideDelay: 5000
          });
          change = true;
        }
        if (data.error) {
          const error = data.error;
          if (error.original)
            this.$bvToast.toast(error.original.detail, {
              title: "Edycja wizyty.",
              autoHideDelay: 5000,
              appendToast: true
            });
          if (error.errors.length) {
            let description = "";
            description = error.errors.map(error => error.path).join(", ");
            this.$bvToast.toast(`Niepoprawne dane w polach ${description}.`, {
              title: "Edycja wizyty.",
              autoHideDelay: 5000,
              appendToast: true
            });
          }
        }
      } else {
        const response = await this.$api.post(`visit/add`, {
          doctorId: this.selectedDoctor.id,
          pantientId: this.selectedPantient.id,
          date,
          description: this.editDescription
        });
        const data = response.data;
        if (data.item) {
          this.$bvToast.toast("Dodano wizytę.", {
            title: "Dodawanie wizyty.",
            autoHideDelay: 5000
          });
          change = true;
        }
        if (data.error) {
          const error = data.error;
          if (error.original)
            this.$bvToast.toast(error.original.detail, {
              title: "Dodawanie wizyty.",
              autoHideDelay: 5000,
              appendToast: true
            });
          if (error.errors.length) {
            let description = "";
            description = error.errors.map(error => error.path).join(", ");
            this.$bvToast.toast(`Niepoprawne dane w polach ${description}.`, {
              title: "Dodawanie wizyty.",
              autoHideDelay: 5000,
              appendToast: true
            });
          }
        }
      }
      if (change) {
        this.$refs.table.clearSelected();
        this.editDoctor = null;
        this.editPantient = null;
        this.editDate = null;
        this.editTime = null;
        this.editDescription = "";
      }
      this.loadVisit();
    },
    changeHour() {
      if (!this.editTime) {
        this.editDate = null;
      }
    },
    changeDoctor() {
      if (this.selectedDoctor) {
        this.loadFreeDays(this.selectedDoctor.id);
      }
    },
    changeDate() {
      if (this.editDate) {
        this.loadFreeHour();
      }
      this.editTime = null;
    },
    changePage(id) {
      var router = "/visit";
      if (id > 1) router += "/" + id;
      this.$router.push(router);
      this.loadVisit();
    },
    async loadVisit() {
      this.page = this.$route.params.id;
      if (this.page === undefined) this.page = 1;
      this.$api
        .get(`visits/${this.page - 1}`)
        .then(response => {
          const { count, rows } = response.data;
          this.items = rows;
          this.totalPage = Math.ceil(count / 100);
        })
        .catch(error => {
          console.log(error);
        });
    },
    async loadPantients() {
      this.$api
        .get(`allpantients`)
        .then(response => {
          this.pantients = response.data.items;
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadDoctors() {
      this.$api
        .get(`alldoctors`)
        .then(response => {
          this.doctors = response.data.items;
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadFreeDays(doctorId) {
      this.$api
        .get(`/visit/day/${doctorId}`)
        .then(response => {
          this.freeDate = response.data;
          this.freeDay = this.freeDate.map(data =>
            moment(data).format("DD.MM.YYYY")
          );
          this.freeDay = this.freeDay.filter(
            (v, i) => this.freeDay.indexOf(v) === i
          );
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadFreeHour() {
      if (this.freeDay.length > 0) {
        this.freeHour = this.freeDate
          .map(data => moment(data).format("DD.MM.YYYY HH:mm"))
          .filter(date => date.includes(this.editDate))
          .map(date => date.substring(date.length - 6, date.length));
      }
    }
  },

  created() {
    this.loadVisit();
    this.loadPantients();
    this.loadDoctors();
  }
};
</script>
<style scoped>
#visit {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.searchBar {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 5px 0px;
}
.button-container {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding-right: 0px;
}
</style>
