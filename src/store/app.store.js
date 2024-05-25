import { makeAutoObservable } from 'mobx';

class Store {
	constructor() {
		makeAutoObservable(this);

		// makePersistable(this, {
		//   name: "appStore",
		//   properties: ['isAuth', 'userId', 'companies', 'currentCompanyID', 'token'],
		//   storage: window.localStorage
		// })
	}

	sidebarMenuIsOpen = true;

	closeSidebarMenu = () => (this.sidebarMenuIsOpen = false);
	openSidebarMenu = () => (this.sidebarMenuIsOpen = true);
	toggleSidebarMenu = () => (this.sidebarMenuIsOpen = !this.sidebarMenuIsOpen);
}

const appStore = new Store();
export default appStore;
