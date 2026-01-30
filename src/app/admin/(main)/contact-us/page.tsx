import { InitialTableState, TableState } from "@tanstack/react-table";
import { searchContactMessages } from "@/app/(landing)/contact-us/actions";
import ContactUsTable from "./contact-us-table";

const initialTableState: InitialTableState = {
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  sorting: [{ id: "createdAt", desc: true }],
};

export default async function ContactUsPage() {
  const tableState = initialTableState as TableState;
  const { messages, total } = await searchContactMessages(tableState);

  return (
    <div className="p-6">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold">Contact submissions</h1>
        <p className="text-muted-foreground">
          Review and respond to incoming messages.
        </p>
      </div>
      <ContactUsTable
        initialMessages={messages}
        initialTotal={total}
        initialState={tableState}
      />
    </div>
  );
}
