<template>
  <div id="schedule">
    <h1>Harmonogram</h1>
    <div class="form">
      <b-form-input
        list="my-list-id"
        v-model="selected"
        @change="getSchedule"
        placeholder="Wybierz lekarza"
      ></b-form-input>
      <datalist id="my-list-id">
        <option v-for="schedule in items" v-bind:key="schedule.id">{{
          schedule.firstname + " " + schedule.lastname
        }}</option>
      </datalist>
      <div class="searchBar">
        <b-button
          variant="primary"
          :disabled="
            !selectedDoctor || !!selectedSchedule || schedules.length == 7
          "
          @click="add"
          >Dodaj</b-button
        >
        <b-button
          variant="secondary"
          :disabled="!selectedDoctor || !selectedSchedule"
          @click="edit"
          >Edytuj</b-button
        >
        <b-button
          variant="danger"
          :disabled="!selectedDoctor || !selectedSchedule"
          @click="remove"
          >Usuń</b-button
        >
      </div>
      <b-table
        ref="table"
        selectable
        select-mode="single"
        striped
        hover
        small
        fixed
        :items="schedules"
        :fields="fields"
        show-empty
        @row-selected="select"
      >
        <template slot="dayOfWeek" slot-scope="data">{{
          days[data.item.dayOfWeek]
        }}</template>
      </b-table>
    </div>
    <b-modal
      :title="!selectedDoctor ? 'Edycja harmonogramu' : 'Dodanie harmonogramu'"
      centered
      no-close-on-backdrop
      no-close-on-esc
      v-model="visible"
      @ok="ok"
      @cancel="cancel"
    >
      <div>
        <b-form-select
          class="mb-3"
          v-model="dayOfWeek"
          :options="optionsDays"
        ></b-form-select>
        <b-form-select
          :options="options"
          class="mb-3"
          v-model="hourOpen"
        ></b-form-select>
        <b-form-select
          :options="secondOption"
          class="mb-3"
          v-model="hourClose"
        ></b-form-select>
      </div>
    </b-modal>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "schedule",
  components: {},
  computed: {
    secondOption() {
      return this.options.filter(item => item.value > this.hourOpen);
    },
    optionsDays() {
      return this.daysWeek.filter(
        item =>
          item.value === this.dayOfWeek ||
          !this.schedules
            .map(schedule => schedule.dayOfWeek)
            .includes(item.value)
      );
    },
    selectedDoctor() {
      let item = null;
      if (this.selected) {
        const split = this.selected.split(" ");
        const firstname = split[0];
        const lastname = split[1];
        const index = this.items.findIndex(
          item => item.firstname === firstname && item.lastname === lastname
        );
        item = this.items[index];
      }
      return item;
    }
  },
  data: () => {
    return {
      fields: {
        dayOfWeek: {
          label: "Dzień tygodnia"
        },
        hourOpen: {
          label: "Godzina rozpoczęcia"
        },
        hourClose: {
          label: "Godzina zakończenia"
        }
      },
      daysWeek: [
        { value: 0, text: "Poniedziałek" },
        { value: 1, text: "Wtorek" },
        { value: 2, text: "Środa" },
        { value: 3, text: "Czwartek" },
        { value: 4, text: "Piątek" },
        { value: 5, text: "Sobota" },
        { value: 6, text: "Niedziela" }
      ],
      items: [],
      selected: "",
      schedules: [],
      visible: false,
      days: [
        "Poniedziałek",
        "Wtorek",
        "Środa",
        "Czwartek",
        "Piątek",
        "Sobota",
        "Niedziela"
      ],
      options: [],
      dayOfWeek: -1,
      hourOpen: 0,
      hourClose: 0,
      selectedSchedule: null
    };
  },
  methods: {
    select(items) {
      this.selectedSchedule = items[0];
    },
    remove() {
      const { dayOfWeek, id } = this.selectedSchedule;
      this.$bvModal
        .msgBoxConfirm(
          `Czy chcesz usunąć harmonogram ${this.days[dayOfWeek]} ?`,
          {
            title: "Usuwanie harmonogramu",
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
          const response = await this.$api.delete(`schedule/remove/${id}`);
          const data = response.data;
          if (data.item) {
            this.$bvToast.toast("Usunięto dane.", {
              title: "Usuwanie harmonogramu.",
              autoHideDelay: 5000
            });
            this.getSchedule();
          }
          if (data.error) {
            const error = data.error;
            if (error.original)
              this.$bvToast.toast(error.original.detail, {
                title: "Usuwanie harmonogramu.",
                autoHideDelay: 5000,
                appendToast: true
              });
            if (error.errors.length) {
              let description = "";
              description = error.errors.map(error => error.path).join(", ");
              this.$bvToast.toast(`Niepoprawne dane w polach ${description}.`, {
                title: "Usuwanie harmonogramu.",
                autoHideDelay: 5000,
                appendToast: true
              });
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    edit() {
      const { dayOfWeek, hourOpen, hourClose } = this.selectedSchedule;
      this.dayOfWeek = dayOfWeek;
      this.hourOpen = Number(hourOpen.split(":")[0]);
      this.hourClose = Number(hourClose.split(":")[0]);
      this.visible = true;
    },
    add() {
      this.visible = true;
    },
    cancel() {
      this.hourOpen = 0;
      this.hourClose = 0;
      this.dayOfWeek = -1;
      this.selectedSchedule = null;
      this.$refs.table.clearSelected();
    },
    async ok() {
      let change = false;
      if (this.selected && this.selectedSchedule) {
        const response = await this.$api.post(`schedule/edit`, {
          id: this.selectedSchedule.id,
          dayOfWeek: this.dayOfWeek,
          hourOpen: `${this.hourOpen < 10 ? "0" : ""}${this.hourOpen}:00:00`,
          hourClose: `${this.hourClose < 10 ? "0" : ""}${this.hourClose}:00:00`
        });
        const data = response.data;
        if (data.item) {
          this.$bvToast.toast("Dane zmienione.", {
            title: "Edycja harmonogramu.",
            autoHideDelay: 5000
          });
          change = true;
        }
        if (data.error) {
          const error = data.error;
          if (error.original)
            this.$bvToast.toast(error.original.detail, {
              title: "Edycja harmonogramu.",
              autoHideDelay: 5000,
              appendToast: true
            });
          if (error.errors.length) {
            let description = "";
            description = error.errors.map(error => error.path).join(", ");
            this.$bvToast.toast(`Niepoprawne dane w polach ${description}.`, {
              title: "Edycja harmonogramu.",
              autoHideDelay: 5000,
              appendToast: true
            });
          }
        }
      } else {
        const response = await this.$api.post(`schedule/add`, {
          doctorId: this.selectedDoctor.id,
          dayOfWeek: this.dayOfWeek,
          hourOpen: `${this.hourOpen < 10 ? "0" : ""}${this.hourOpen}:00:00`,
          hourClose: `${this.hourClose < 10 ? "0" : ""}${this.hourClose}:00:00`
        });
        const data = response.data;
        if (data.item) {
          this.$bvToast.toast("Dodano harmonogram.", {
            title: "Dodawanie harmonogramu.",
            autoHideDelay: 5000
          });
          change = true;
        }
        if (data.error) {
          const error = data.error;
          if (error.original)
            this.$bvToast.toast(error.original.detail, {
              title: "Dodawanie harmonogramu.",
              autoHideDelay: 5000,
              appendToast: true
            });
          if (error.errors.length) {
            let description = "";
            description = error.errors.map(error => error.path).join(", ");
            this.$bvToast.toast(`Niepoprawne dane w polach ${description}.`, {
              title: "Dodawanie harmonogramu.",
              autoHideDelay: 5000,
              appendToast: true
            });
          }
        }
      }
      if (change) {
        this.$refs.table.clearSelected();
        this.getSchedule();
        this.dayOfWeek = -1;
        this.hourOpen = 0;
        this.hourClose = 0;
      }
    },
    getSchedule() {
      if (this.selected.length > 0) {
        this.$api
          .get(`schedule/search/${this.selectedDoctor.id}`)
          .then(response => {
            this.schedules = response.data.item;
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.schedules = [];
      }
    },
    loadDoctors() {
      this.$api
        .get(`alldoctors`)
        .then(response => {
          console.log(response);
          this.items = response.data.items;
        })
        .catch(error => {
          console.log(error);
        });
    },
    createdOptions() {
      for (let i = 8; i <= 22; i++) {
        this.options.push({ value: i, text: `${i < 10 ? "0" : ""}${i}:00:00` });
      }
    }
  },
  created() {
    this.loadDoctors();
    this.createdOptions();
  }
};
</script>
<style scoped>
#schedule {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.searchBar {
  display: flex;
  width: 100%;
  padding: 10px 0px;
}
button {
}
</style>
