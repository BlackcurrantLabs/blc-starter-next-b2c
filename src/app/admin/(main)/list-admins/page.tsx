import type { TableQuery } from "@/components/tables/table-features";
import ListUsers from "../list-users/page";

export default async function ListAdmins() {
  // Define a default initial state
  const adminInitialState: TableQuery = {
    globalFilter: "",
    columnFilters: [
      {
        id: "role",
        value: ["admin"],
      },
    ],
    sorting: [
      {
        id: "createdAt",
        desc: true,
      },
    ],
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  };
  return <ListUsers initialState={adminInitialState}></ListUsers>;
}
