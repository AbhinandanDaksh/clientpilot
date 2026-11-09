export const workspaceRoutes = [
  {
    "label": "Overview",
    "href": "/dashboard"
  },
  {
    "label": "Lead Hunter",
    "href": "/lead-hunter"
  },
  {
    "label": "Website Auditor",
    "href": "/website-auditor"
  },
  {
    "label": "AI Writer",
    "href": "/ai-writer"
  },
  {
    "label": "Deal Room",
    "href": "/deal-room"
  },
  {
    "label": "Conversations",
    "href": "/conversations"
  },
  {
    "label": "Follow-up Calendar",
    "href": "/follow-up-calendar"
  },
  {
    "label": "Analytics",
    "href": "/analytics"
  },
  {
    "label": "Agent Activity",
    "href": "/agent-activity"
  },
  {
    "label": "Settings",
    "href": "/settings"
  },
  {
    "label": "Upgrade plan",
    "href": "/upgrade-plan"
  }
] as const;

export function workspaceHref(label: string): string {
  return workspaceRoutes.find((route) => route.label === label)?.href ?? "/dashboard";
}
