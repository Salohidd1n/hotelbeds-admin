import { useEffect, useMemo } from 'react';
import tablesStore from 'store/tables.store';
import { listToMap } from 'utils/listToMap';

const useTableColumns = (tableSlug, columns) => {
	const columnsFromStore = tablesStore.columns[tableSlug];

	// const updateColumns = () => {
	//   if(!columns) return
	//   if(!columnsFromStore) tablesStore.setTableColumns(tableSlug, columns.map(column => ({ ...column, isVisible: true })))

	//   else {
	//     const result = computeColumns(columnsFromStore, columns)
	//     tablesStore.setTableColumns(tableSlug, result)
	//   }
	// }

	const setColumns = (columns) => {
		tablesStore.setTableColumns(tableSlug, columns);
	};

	const viewColumns = useMemo(() => {
		return columnsFromStore?.filter((column) => column.isVisible) ?? [];
	}, [columnsFromStore]);

	useEffect(() => {
		if (!columns) return;
		setColumns(columns?.map((column) => ({ ...column, isVisible: true })));
	}, []);

	return { computedColumns: columnsFromStore, viewColumns, setColumns };
};

// const computeColumns = (storeColumns, columns) => {
//   const computedColumns = []
//   const columnsMap = listToMap(columns, 'key')

//   storeColumns?.forEach((column) => {
//     if(columnsMap[column.key]) {
//       computedColumns.push({
//         ...columnsMap[column.key],
//         isVisible: column.isVisible
//       })

//       delete columnsMap[column.key]
//     }
//   })

//   return [...computedColumns, ...Object.keys(columnsMap).map(column => ({ ...column, isVisible: true }))]
// }

export default useTableColumns;
