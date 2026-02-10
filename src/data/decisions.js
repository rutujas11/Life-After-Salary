export default [
  {
    id: "rent",
    icon: "🏠",
    title: "Monthly Rent",
    options: [
      {
        label: "Shared Apartment - ₹8,000",
        impact: { balance: -8000, stress: -5, creditScore: 2 },
        tags: ["💰 Budget-Friendly", "😌 Less Stress"],
      },
      {
        label: "1BHK - ₹15,000",
        impact: { balance: -15000, stress: 5, creditScore: 0 },
        tags: ["🏡 Comfort", "💸 Moderate Cost"],
      },
      {
        label: "Luxury 2BHK - ₹30,000",
        impact: { balance: -30000, stress: 15, creditScore: -5 },
        tags: ["⚠️ Expensive", "😰 High Stress"],
      },
    ],
  },

  {
    id: "food",
    icon: "🍔",
    title: "Food Expenses",
    options: [
      {
        label: "Cook at Home - ₹5,000",
        impact: { balance: -5000, stress: -3, creditScore: 3 },
        tags: ["💪 Healthy", "💰 Saves Money"],
      },
      {
        label: "Mixed (Home + Eating Out) - ₹12,000",
        impact: { balance: -12000, stress: 0, creditScore: 0 },
        tags: ["⚖️ Balanced"],
      },
      {
        label: "Daily Zomato/Swiggy - ₹20,000",
        impact: { balance: -20000, stress: -5, creditScore: -5 },
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
        label: "Pay Full Amount - ₹10,000",
        impact: { balance: -10000, stress: -10, creditScore: 15 },
        tags: ["✅ Smart Choice", "📈 Credit Boost"],
      },
      {
        label: "Pay Minimum Due - ₹2,000",
        impact: { balance: -2000, stress: 10, creditScore: -10 },
        tags: ["⚠️ Interest Builds", "📉 Credit Drop"],
      },
      {
        label: "Skip Payment",
        impact: { balance: 0, stress: 25, creditScore: -30 },
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
        label: "Start SIP - ₹5,000/month",
        impact: { balance: -5000, stress: -5, wealth: 5500, investments: 5000 },
        tags: ["📈 Growth", "💡 Future Planning"],
      },
      {
        label: "Fixed Deposit - ₹10,000",
        impact: { balance: -10000, stress: -3, wealth: 10300, investments: 10000 },
        tags: ["🔒 Safe", "💰 Steady Returns"],
      },
      {
        label: "Skip This Month",
        impact: { balance: 0, stress: 5, creditScore: -2 },
        tags: ["⚠️ Missed Opportunity"],
      },
    ],
  },
];