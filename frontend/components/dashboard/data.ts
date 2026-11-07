import {
  LuCompass,
  LuTarget,
  LuFileSearch,
  LuPencilLine,
  LuMessageCircle,
  LuCalendarDays,
  LuZap,
} from "react-icons/lu";
// Sample data for the dashboard preview. Replace with API data when connected.
export const metrics = [
  {
    icon: LuCompass,
    tone: "bg-dash-peach text-dash-primary",
    label: "Leads discovered",
    value: "24",
    change: "+18%",
  },
  {
    icon: LuTarget,
    tone: "bg-dash-sage text-dash-green",
    label: "Qualified leads",
    value: "11",
    change: "+12%",
  },
  {
    icon: LuFileSearch,
    tone: "bg-dash-lavender text-dash-purple",
    label: "Audits completed",
    value: "08",
    change: "+24%",
  },
  {
    icon: LuPencilLine,
    tone: "bg-dash-sand text-dash-orange",
    label: "Drafts awaiting approval",
    value: "06",
    change: "3 new",
  },
  {
    icon: LuMessageCircle,
    tone: "bg-dash-sky text-dash-blue",
    label: "Client replies",
    value: "07",
    change: "+2 today",
  },
  {
    icon: LuCalendarDays,
    tone: "bg-dash-gold-bg text-dash-gold",
    label: "Meetings booked",
    value: "03",
    change: "This week",
  },
];
export const agents = [
  {
    name: "Lead Hunter",
    icon: LuCompass,
    tone: "bg-dash-peach text-dash-primary",
    description: "Finding your next opportunity",
    time: "18 min",
  },
  {
    name: "Website Auditor",
    icon: LuFileSearch,
    tone: "bg-dash-lavender text-dash-purple",
    description: "Spotting high-impact gaps",
    time: "42 min",
  },
  {
    name: "AI Writer",
    icon: LuPencilLine,
    tone: "bg-dash-sage text-dash-green",
    description: "Preparing thoughtful outreach",
    time: "1 hr",
  },
  {
    name: "Follow-up Agent",
    icon: LuZap,
    tone: "bg-dash-sand text-dash-orange",
    description: "Keeping conversations warm",
    time: "2 hrs",
  },
];
export const leads = [
  {
    name: "Bloom Studio",
    type: "Design & interiors",
    initials: "BS",
    score: 94,
  },
  { name: "The Good Bean", type: "Food & beverage", initials: "GB", score: 89 },
  {
    name: "Northside Dental",
    type: "Health & wellness",
    initials: "ND",
    score: 86,
  },
];
