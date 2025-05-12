import type { ColumnDef } from "@tanstack/vue-table";
import type { Lead } from "~/components/leads/data/schema";
import LeadsTableColumnHeader from "./TableColumnHeader.vue";
import { countries, devices } from "./data/data";
import { formatDate } from "@vueuse/core";

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) =>
      h(LeadsTableColumnHeader, { column, title: "Date", class: "ml-4" }),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const dayjs = useDayjs();
      const formatted = dayjs(date).format("lll");

      return h("div", { class: "ml-4" }, formatted);
    },
    sortingFn: "datetime",
    size: 160,
    maxSize: 160,
  },
  {
    accessorKey: "email",
    header: ({ column }) =>
      h(LeadsTableColumnHeader, { column, title: "Email" }),
    cell: ({ row }) =>
      h("div", { class: " truncate font-medium" }, row.getValue("email")),
    enableSorting: true,
    size: 250,
    minSize: 250,
    maxSize: 250,
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
    size: 140,
    maxSize: 140,
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
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
];
