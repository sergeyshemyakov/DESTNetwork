interface Category {
  name: string;
  icon: string;
}

export const categories: Record<number, Category> = {
  0: {
    name: "Medicine",
    icon: "/med.png",
  },
  1: {
    name: "Supplies",
    icon: "/med.png",
  },
  2: {
    name: "Supplies2",
    icon: "/med.png",
  },
};

export const SubmissionsStates = {
  "To verify": "verify",
  Finalized: "finalized",
  Disputed: "disputed",
  Resolved: "resolved",
};
