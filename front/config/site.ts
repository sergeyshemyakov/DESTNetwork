export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "DEST Network",
  description:
    "Dest is a decentralized platform that encourages individuals to securely stash  resources, fostering community aid and resilience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Stash Campaigns",
      href: "/campaigns",
    },
  ],
  mainCards: [
    {
      title: "Secure resources. Build community aid.",
      text: "DEST incentivizes users in a particular area to create stashes of some items, to prepare for a natural disaster (medicine, inflatable boats, radio receivers).      ",
    },
    {
      title: "Destnet a DePIN (Decentrilized Public Infrastructure Network)",
      text: "Destnet a DePIN project, where the idea of a public infrastructure is expanded beyond usual use cases.",
    },
    {
      title: "Social consensus. Independent verification",
      text: "Correctness of everything rests on the social consensus: submitted stashes are verified by other users and independent disputors.",
    },
  ],
  links: {
    github: "https://github.com/sergeyshemyakov/DESTNetwork",
  },
};
