import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

class Store {
	constructor() {
		makeAutoObservable(this);
		// makePersistable(this, {
		//   name: "columns",
		//   properties: ["columns"],
		//   storage: window.localStorage,
		// });
	}

	columns = {};

	setTableColumns = (tableSlug, columns) => {
		this.columns[tableSlug] = columns;
	};
}

const tablesStore = new Store();
export default tablesStore;
