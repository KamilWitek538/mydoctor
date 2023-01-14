<template>
  <div id="pantient">
    <h1>Pacjenci</h1>
    <div class="searchBar">
      <b-button variant="primary" :disabled="!!selected" @click="add"
        >Dodaj</b-button
      >
      <b-button variant="secondary" :disabled="!selected" @click="edit"
        >Edytuj</b-button
      >
      <b-button variant="danger" :disabled="!selected" @click="remove"
        >Usuń</b-button
      >
    </div>
    <!-- <div class="searchBar">
      <b-form-input v-model="selectedFirstname" placeholder="Podaj imię" type="text"></b-form-input>
      <b-form-input v-model="selectedLastname" placeholder="Podaj nazwisko" type="text"></b-form-input>
      <b-form-input v-model="selectedStreet" placeholder="Podaj ulicę" type="text"></b-form-input>
      <b-form-input v-model="selectedCity" placeholder="Podaj ulicę" type="text"></b-form-input>
      <b-form-input v-model="selectedPostcode" placeholder="Podaj kod pocztowy" type="text"></b-form-input>
      <b-form-input v-model="selectedPhone" placeholder="Podaj telefon" type="number"></b-form-input>
      <b-form-input v-model="selectedPesel" placeholder="Podaj pesel" type="number"></b-form-input>
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
      show-empty
    ></b-table>
    <b-pagination
      v-model="page"
      :total-rows="totalPage"
      per-page="1"
      class="my-0"
      @change="changePage"
    ></b-pagination>
    <b-modal
      :title="!!selected ? 'Edycja pacjenta' : 'Dodaj pacjenta'"
      centered
      @ok="ok"
      @cancel="cancel"
      no-close-on-backdrop
      no-close-on-esc
      v-model="visible"
    >
      <b-form-input
        v-model="editFirstname"
        placeholder="Podaj imię"
        type="text"
        :state="validationFirstname"
        required
      ></b-form-input>
      <b-form-input
        v-model="editLastname"
        placeholder="Podaj nazwisko"
        type="text"
        :state="validationLastname"
        required
      ></b-form-input>
      <b-form-input
        v-model="editStreet"
        placeholder="Podaj ulicę"
        type="text"
        :state="validationStreet"
        required
      ></b-form-input>
      <b-form-input
        v-model="editCity"
        placeholder="Podaj miasto"
        type="text"
        :state="validationCity"
        required
      ></b-form-input>
      <b-form-input
        v-model="editPostcode"
        placeholder="Podaj kod pocztowy"
        type="text"
        :state="validationPostcode"
        required
      ></b-form-input>
      <b-form-input
        v-model="editPhone"
        placeholder="Podaj telefon"
        type="number"
        :state="validationPhone"
        required
      ></b-form-input>
      <b-form-input
        v-model="editPesel"
        placeholder="Podaj pesel"
        type="number"
        :state="validationPesel"
        required
      ></b-form-input>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "visit",
  components: {},
  computed: {
    validationFirstname() {
      return this.editFirstname.length > 0 ? true : false;
    },
    validationLastname() {
      return this.editLastname.length > 0 ? true : false;
    },
    validationStreet() {
      return this.editStreet.length > 0 ? true : false;
    },
    validationCity() {
      return this.editCity.length > 0 ? true : false;
    },
    validationPostcode() {
      var regex = /[0-9]{2}-[0-9]{3}/g;
      return !!this.editPostcode.match(regex);
    },
    validationPhone() {
      var regex = /[1-9]{1}[0-9]{8}/g;
      return !!this.editPhone.match(regex);
    },
    validationPesel() {
      let weight = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
      let sum = 0;
      let controlNumber = parseInt(this.editPesel.substring(10, 11));
      for (let i = 0; i < weight.length; i++) {
        sum += parseInt(this.editPesel.substring(i, i + 1)) * weight[i];
      }
      sum = sum % 10;
      return 10 - sum === controlNumber;
    }
  },
  data: () => {
    return {
      fields: {
        firstname: {
          label: "Imie",
          sortable: true
        },
        lastname: {
          label: "Nazwisko",
          sortable: true
        },
        street: {
          label: "Ulica",
          sortable: true
        },
        city: {
          label: "Miejscowość",
          sortable: true
        },
        postcode: {
          label: "Kod pocztowy",
          sortable: true
        },
        phone: {
          label: "Telefon",
          sortable: true
        },
        pesel: {
          label: "Pesel",
          sortable: true
        }
      },
      items: [
        {
          firstname: "Janusz",
          lastname: "Trasz",
          street: "Daszyńskiego 30",
          city: "Kraków",
          postcode: "31-521",
          phone: "123456789",
          pesel: "12365445123"
        },
        {
          firstname: "Jan",
          lastname: "Wójcik",
          street: "Dmowskiego 30",
          city: "Kraków",
          postcode: "31-521",
          phone: "123456589",
          pesel: "12365435123"
        }
      ],
      selectedFirstname: "",
      selectedLastname: "",
      selectedStreet: "",
      selectedCity: "",
      selectedPostcode: "",
      selectedPhone: null,
      selectedPesel: null,
      editFirstname: "",
      editLastname: "",
      editStreet: "",
      editCity: "",
      editPostcode: "",
      editPhone: "",
      editPesel: "",
      selected: null,
      page: 1,
      totalPage: 10,
      visible: false
    };
  },
  methods: {
    select(items) {
      this.selected = items[0];
    },
    async remove() {
      const { firstname, lastname, pesel, id } = this.selected;
      const modalConfirm = await this.$bvModal.msgBoxConfirm(
        `Czy chcesz usunąć pacjenta ${firstname} ${lastname} o numerze Pesel ${pesel} ?`,
        {
          title: "Usuwanie pacjenta",
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
      );
      if (!modalConfirm) return;
      const response = await this.$api.delete(`pantients/${id}`);
      if (response.status < 300)
        this.$bvToast.toast("Usunięto dane.", {
          title: "Usuwanie pacjenta.",
          autoHideDelay: 5000
        });

      this.clear();
    },
    edit() {
      const {
        firstname,
        lastname,
        street,
        city,
        postcode,
        phone,
        pesel
      } = this.selected;
      this.editFirstname = firstname;
      this.editLastname = lastname;
      this.editStreet = street;
      this.editCity = city;
      this.editPostcode = postcode;
      this.editPhone = phone;
      this.editPesel = pesel;
      this.visible = true;
    },
    add() {
      this.visible = true;
    },
    cancel() {
      this.selected = null;
      this.editFirstname = "";
      this.editLastname = "";
      this.editStreet = "";
      this.editCity = "";
      this.editPostcode = "";
      this.editPhone = "";
      this.editPesel = "";
      this.$refs.table.clearSelected();
    },
    clear() {
      this.cancel();
      this.loadPantients();
    },
    async ok() {
      let pantient = {
        firstname: this.editFirstname,
        lastname: this.editLastname,
        street: this.editStreet,
        city: this.editCity,
        postcode: this.editPostcode,
        phone: this.editPhone,
        pesel: this.editPesel
      };

      let response = null;
      try {
        if (this.selected) {
          const pantientId = this.items.find(i => i === this.selected).id;
          response = await this.$api.put(`pantients/${pantientId}`, pantient);
        } else {
          response = await this.$api.post(`pantients`, pantient);
        }
        if (response.status < 300) {
          this.$bvToast.toast(
            this.selected ? "Dane zmienione." : "Pacjent został dodany.",
            {
              title: this.selected
                ? "Edytowanie pacjenta."
                : "Dodawanie pacjenta.",
              autoHideDelay: 5000
            }
          );
        }
      } catch (error) {
        this.$bvToast.toast(`Niepoprawne dane w polach.`, {
          title: this.selected ? "Edytowanie lekarza." : "Dodawanie lekarza.",
          autoHideDelay: 5000,
          appendToast: true
        });
      }
      this.clear();
    },
    changePage(id) {
      var router = "/pantient";
      if (id > 1) router += "/" + id;
      this.$router.push(router);
      this.loadPantients();
    },
    async loadPantients() {
      this.page = this.$route.params.id;
      if (this.page === undefined) this.page = 1;
      this.$api
        .get(`pantients/offset/${this.page - 1}`)
        .then(response => {
          const { count, rows } = response.data;
          this.items = rows;
          this.totalPage = Math.ceil(count / 100);
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    this.loadPantients();
  }
};
</script>
<style scoped>
#pantient {
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
