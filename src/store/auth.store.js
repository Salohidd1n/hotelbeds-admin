import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

class Store {
  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: "authStore",
      properties: ["isAuth", "userData", "token"],
      storage: window.localStorage,
    });
  }

  isAuth = false;
  userData = {};
  token = {};

  setIsAuth(value) {
    this.isAuth = value;
  }

  login(data) {
    this.isAuth = true;
    this.userData = data.user;
    this.token = data.token;
  }

  logout() {
    this.isAuth = false;
    this.userData = {};
    this.token = {};
  }
}

const authStore = new Store();
export default authStore;
