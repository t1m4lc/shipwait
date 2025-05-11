import { h } from "vue";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CheckCircle,
  Circle,
  XCircle,
  HelpCircle,
  Timer,
} from "lucide-vue-next";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: h(HelpCircle),
  },
  {
    value: "todo",
    label: "Todo",
    icon: h(Circle),
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: h(Timer),
  },
  {
    value: "done",
    label: "Done",
    icon: h(CheckCircle),
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: h(XCircle),
  },
];

export const priorities = [
  {
    value: "low",
    label: "Low",
    icon: h(ChevronDown),
  },
  {
    value: "medium",
    label: "Medium",
    icon: h(ChevronRight),
  },
  {
    value: "high",
    label: "High",
    icon: h(ChevronUp),
  },
];
