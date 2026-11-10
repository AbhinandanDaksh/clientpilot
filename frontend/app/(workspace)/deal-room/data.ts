export type Client = {
  id: number;
  name: string;
  initials: string;
  channel: string;
  status: string;
  unread: boolean;
  activity: string;
  intent: string;
  suggestion: string;
  caution: string;
  action: string;
  messages: { text: string; time: string; outgoing?: boolean }[];
};

export const demoClients: Client[] = [
  {
    id: 1, name: "The Daily Grind", initials: "TG", channel: "Instagram DM", status: "Interested", unread: true, activity: "New reply · 12m",
    intent: "Exploring fit and pricing",
    suggestion: "Absolutely. I typically start with a short discovery call so I can understand the scope, then I send a clear fixed-price proposal. Would a 15-minute chat this week be useful?",
    caution: "Avoid sending a vague hourly estimate before understanding the scope.", action: "Suggest a 15-minute call",
    messages: [
      { text: "Hi, thanks for reaching out. How much would something like this cost?", time: "10:42 AM" },
      { text: "Happy to share a range. It depends on the pages and goals, but I can give you a clear starting point after a quick look.", time: "10:48 AM", outgoing: true },
      { text: "That sounds fair. Tell me a little more about how you work.", time: "10:51 AM" },
    ],
  },
  {
    id: 2, name: "Bloom Dental Studio", initials: "BD", channel: "Email", status: "Discovery", unread: false, activity: "Last message yesterday",
    intent: "Understanding the booking experience",
    suggestion: "I'd start by understanding how patients currently book and what your team needs. We can then outline a simpler appointment journey together. Would a short call help?",
    caution: "Confirm the practice's requirements before promising booking integrations.", action: "Discuss the appointment journey",
    messages: [{ text: "We'd like to make booking appointments easier. What would you need from us?", time: "Yesterday · 2:15 PM" }],
  },
  {
    id: 3, name: "Nook & Nest", initials: "NN", channel: "Instagram DM", status: "Considering", unread: false, activity: "Last message yesterday",
    intent: "Comparing options for a new website",
    suggestion: "We can begin with a small, focused website that showcases your products and makes enquiries easy. Would you like me to outline a simple first phase?",
    caution: "Avoid committing to an online store before confirming the product catalogue and budget.", action: "Outline a focused first phase",
    messages: [{ text: "We're considering a website, but we want to start small. Is that possible?", time: "Yesterday · 11:30 AM" }],
  },
  {
    id: 4, name: "Aura Skin & Spa", initials: "AS", channel: "Email", status: "Interested", unread: false, activity: "Last message yesterday",
    intent: "Exploring timelines and next steps",
    suggestion: "I'd be happy to outline a timeline after we agree on the pages, content and booking needs. Would it help to walk through those together first?",
    caution: "Agree on content, scope and approvals before promising a delivery date.", action: "Confirm scope and content readiness",
    messages: [{ text: "How long would a new website take, and what are the next steps?", time: "Yesterday · 4:20 PM" }],
  },
];
