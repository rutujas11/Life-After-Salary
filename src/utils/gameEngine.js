// src/utils/gameEngine.js

import { calculateOptionCost } from "./calculateCost";

export function processMonth({
  gameState,
  decisions,
  currentSalary,
  currentCity,
}) {
  const salaryValue = currentSalary || 50000;
  const updatedState = { ...gameState };

  // Add monthly salary.
  updatedState.balance += salaryValue;

  updatedState.totalIncome =
    (updatedState.totalIncome || 0) + salaryValue;

  let monthlyExpenses = 0;

  Object.entries(decisions).forEach(([decisionId, option]) => {
    if (!option) return;

    const totalCost = calculateOptionCost(
      option,
      decisionId,
      salaryValue,
      currentCity
    );

    monthlyExpenses += totalCost;

    if (totalCost > 0) {
      updatedState.balance -= totalCost;
    }

    Object.entries(option.impact || {}).forEach(([key, value]) => {
      updatedState[key] = Math.max(
        0,
        (updatedState[key] ?? 0) + value
      );
    });

    if (option.investmentPercent) {
      const investAmount = Math.round(
        salaryValue * option.investmentPercent
      );

      updatedState.investments =
        (updatedState.investments || 0) + investAmount;

      updatedState.wealth =
        (updatedState.wealth || 0) +
        Math.round(investAmount * 1.05);
    }
  });

  updatedState.totalExpenses =
    (updatedState.totalExpenses || 0) + monthlyExpenses;

  updatedState.wealth =
    (updatedState.savings || 0) +
    (updatedState.investments || 0);

  let monthlyScore = 0;

  if (updatedState.balance > 0) {
    monthlyScore += 50;
  }

  monthlyScore += Math.round(
    (updatedState.savings || 0) / 1000
  );

  monthlyScore += Math.round(
    (updatedState.investments || 0) / 1000
  );

  monthlyScore += Math.round(
    (updatedState.wealth || 0) / 5000
  );

  monthlyScore += Math.round(
    (updatedState.creditScore || 0) / 50
  );

  if ((updatedState.stress || 0) < 40) {
    monthlyScore += 30;
  }

  if ((updatedState.stress || 0) > 70) {
    monthlyScore -= 40;
  }

  if (updatedState.balance < 0) {
    monthlyScore -= 100;
  }

  monthlyScore -= Math.round(
    (updatedState.scamRisk || 0) / 5
  );

  updatedState.score = Math.max(
    0,
    (updatedState.score || 0) + monthlyScore
  );

  updatedState.month += 1;

  return {
    gameState: updatedState,
    monthlyExpenses,
    salary: salaryValue,
  };
}