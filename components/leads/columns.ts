import type { ColumnDef } from "@tanstack/vue-table";
import type { Lead } from "~/components/leads/data/schema";
import LeadsTableColumnHeader from "./TableColumnHeader.vue";
import { countries, devices } from "./data/data";
import { formatDate } from "@vueuse/core";

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) =>
      h(LeadsTableColumnHeader, { column, title: "Date" }),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));

      return h(
        "div",
        { class: "font-medium" },
        formatDate(date, "MM/dd/yyyy h:mm a")
      );
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "country",
    header: ({ column }) =>
      h(LeadsTableColumnHeader, { column, title: "Country" }),

    cell: ({ row }) => {
      const countryCode = row.getValue("country") as string;
      const country = countries[countryCode];

      // Use the useCountryFlag composable to get the flag emoji
      const { countryCodeToFlag } = useCountryFlag();
      const flag = countryCodeToFlag(countryCode);

      return h("div", { class: "flex items-center" }, [
        // Display the flag with some spacing
        h("span", { class: "mr-2" }, flag),
        h("span", { class: "truncate font-medium" }, country),
      ]);
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) =>
      h(LeadsTableColumnHeader, { column, title: "Email" }),
    cell: ({ row }) =>
      h(
        "div",
        { class: "max-w-[250px] truncate font-medium" },
        row.getValue("email")
      ),
    enableSorting: true,
    enableHiding: false,
  },

  {
    accessorKey: "device",
    header: ({ column }) =>
      h(LeadsTableColumnHeader, { column, title: "Device" }),

    cell: ({ row }) => {
      const device = devices.find(
        (device) => device.value === row.getValue("device")
      );

      if (!device) return null;

      return h("div", { class: "flex w-[100px] items-center" }, [
        device.icon &&
          h(device.icon, { class: "mr-2 h-4 w-4 text-muted-foreground" }),
        h("span", device.label),
      ]);
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
