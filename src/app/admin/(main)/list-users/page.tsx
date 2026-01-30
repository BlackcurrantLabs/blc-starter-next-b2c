import { InitialTableState, TableState } from "@tanstack/react-table";
import ListUsersTable from "./list-users-table";
import { searchUsers } from "./search.action";

export default async function ListUsers({ initialState }: Readonly<{ initialState?: InitialTableState }>) {

  // Define a default initial state
  const defaultInitialState: InitialTableState = {
    globalFilter: "",
    columnFilters: [
      {
        id: "role",
        value: ["user"],
      },
    ],
    sorting: [
      {
        id: 'createdAt',
        desc: true,
      }
    ],
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  };

  // Use provided initialState or fallback to default
  const state = initialState ?? defaultInitialState;

  // get data table data as per initial state
  const data = await searchUsers(state as TableState);

  // render page with prepopulated initial state and data
  // use only the server action when state changes for changing data based on state
  return <ListUsersTable initialData={data.users} initialTotal={data.total} initialState={state} />;
}
