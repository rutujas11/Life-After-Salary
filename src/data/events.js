export default [
  {
    id: "scam",
    icon: "🚨",
    title: "Scam Alert!",
    description: 'You received a call: "Your KYC needs urgent update. Share OTP now!"',
    options: [
      {
        label: "Share OTP (They sound official)",
        impact: { balance: -25000, stress: 50, scamRisk: 80 },
        outcome: "❌ You lost ₹25,000! Never share OTP with anyone.",
      },
      {
        label: "Hang Up & Report",
        impact: { stress: -10, scamRisk: -20, creditScore: 5 },
        outcome: "✅ Smart move! You avoided a scam and reported it.",
      },
    ],
  },

  {
    id: "medical",
    icon: "🏥",
    title: "Medical Emergency",
    description: "Your family member needs ₹20,000. You have no insurance.",
    options: [
      {
        label: "Use Emergency Savings",
        impact: { balance: -20000, savings: -20000, stress: 5 },
        outcome: "💪 Emergency fund saved the day!",
      },
      {
        label: "Take Personal Loan (18%)",
        impact: { balance: 20000, stress: 30, creditScore: -15 },
        outcome: "⚠️ Loan approved — you’ll repay ₹23,600 in a year.",
      },
      {
        label: "Borrow from Friends",
        impact: { balance: 20000, stress: 15, scamRisk: 10 },
        outcome: "😌 Friend helped. Consider insurance.",
      },
    ],
  },

  {
    id: "bonus",
    icon: "🎉",
    title: "Performance Bonus!",
    description: "You received ₹30,000 as bonus.",
    options: [
      {
        label: "Save 70%, Spend 30%",
        impact: { balance: 30000, savings: 21000, stress: -10, creditScore: 10 },
        outcome: "✅ Saved ₹21,000 and enjoyed the rest guilt-free.",
      },
      {
        label: "Splurge on Shopping",
        impact: { balance: 0, stress: -5, creditScore: -5 },
        outcome: "🛍️ Fun, but missed savings opportunity.",
      },
      {
        label: "Invest Everything",
        impact: { balance: 0, investments: 30000, wealth: 33000, stress: -15 },
        outcome: "📈 Long-term wealth created!",
      },
    ],
  },

  {
    id: "market",
    icon: "📉",
    title: "Market Correction",
    description: "Stock market dropped 15%. Your investments fell ₹5,000.",
    options: [
      {
        label: "Panic Sell Everything",
        impact: { wealth: -8000, stress: 30, investments: -5000 },
        outcome: "❌ Selling at a loss — markets recover!",
      },
      {
        label: "Hold & Stay Calm",
        impact: { stress: 5 },
        outcome: "✅ Good — volatility is normal.",
      },
      {
        label: "Buy More (Averaging)",
        impact: { balance: -5000, investments: 5000, wealth: -2000, stress: -5 },
        outcome: "💡 Buying dips builds wealth!",
      },
    ],
  },
];