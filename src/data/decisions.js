export default [
  {
    id: "rent",
    icon: "🏠",
    title: "Monthly Rent",
    options: [
      {
        label: "Shared Apartment",
        impact: {
          stress: 8,
          creditScore: 5,
        },
        tags: [
          "💰 Cheapest Option",
          "👥 Roommates",
        ],
      },

      {
        label: "PG Accommodation",
        impact: {
          stress: 2,
          creditScore: 2,
        },
        tags: [
          "🍽️ Food Included",
          "⚖️ Balanced",
        ],
      },

      {
        label: "1/2 BHK Flat",
        impact: {
          stress: -5,
          creditScore: -3,
        },
        tags: [
          "🏡 Comfortable",
          "💸 Expensive",
        ],
      },
    ],
  },

  {
    id: "food",
    icon: "🍔",
    title: "Food Expenses",
    options: [
      {
        label: "Cook at Home / Monthly Mess",
        baseCost: 5000,
        impact: { stress: -3, creditScore: 3 },
        tags: ["💪 Healthy", "💰 Saves Money"],
      },
      {
        label: "Mixed (Home + Eating Out)",
        baseCost: 8000,
        impact: { stress: 0 },
        tags: ["⚖️ Balanced"],
      },
      {
        label: "Daily Zomato/Swiggy",
        baseCost: 12000,
        impact: { stress: -5, creditScore: -5 },
        tags: ["⚠️ Expensive", "🍕 Convenient"],
      },
    ],
  },

  {
    id: "credit",
    icon: "💳",
    title: "Credit Card Bill",
    options: [
      {
        label: "Pay Full Amount",
        costPercent: 0.30,
        impact: { stress: -10, creditScore: 15 },
        tags: ["✅ Smart Choice", "📈 Credit Boost"],
      },
      {
        label: "Pay Minimum Due",
        costPercent: 0.10,
        impact: { stress: 10, creditScore: -10 },
        tags: ["⚠️ Interest Builds", "📉 Credit Drop"],
      },
      {
        label: "Skip Payment",
        costPercent: 0,
        impact: { stress: 25, creditScore: -30 },
        tags: ["❌ Bad Idea", "😰 High Stress"],
      },
    ],
  },

  {
    id: "investment",
    icon: "📈",
    title: "Investment",
    options: [
      {
        label: "Start SIP",
        costPercent: 0.20,
        impact: { stress: -5 },
        investmentPercent: 0.20, // grows wealth
        tags: ["📈 Growth", "💡 Future Planning"],
      },
      {
        label: "Fixed Deposit",
        costPercent: 0.30,
        impact: { stress: -3 },
        investmentPercent: 0.30,
        tags: ["🔒 Safe", "💰 Steady Returns"],
      },
      {
        label: "Skip This Month",
        costPercent: 0,
        impact: { stress: 5, creditScore: -2 },
        tags: ["⚠️ Missed Opportunity"],
      },
    ],
  },
];
