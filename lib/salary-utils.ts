export interface SalaryComponents {
  basic: number;
  hra: number;
  standardAllowance: number;
  performanceBonus: number;
  lta: number;
  fixedAllowance: number;
  pfEmployee: number;
  pfEmployer: number;
  professionalTax: number;
}

export function calculateSalaryComponents(monthlyWage: number): SalaryComponents {
  // Common HRMS logic (can be adjusted by admin later)
  const basic = monthlyWage * 0.50; // 50% of monthly wage
  const hra = basic * 0.50; // 50% of basic (standard)
  const standardAllowance = 4167; // Fixed standard deduction / 12 (approx)
  
  // PF is usually 12% of Basic
  const pfEmployee = Math.min(basic * 0.12, 1800); // Capped at 1800 in Many systems
  const pfEmployer = pfEmployee;
  
  const professionalTax = 200; // Fixed
  
  const performanceBonus = monthlyWage * 0.0833; // Approx 1 month salary per year
  const lta = monthlyWage * 0.0833; // Approx 1 month
  
  // Fixes/Other component to balance the total
  const subTotal = basic + hra + standardAllowance + performanceBonus + lta;
  const fixedAllowance = Math.max(0, monthlyWage - subTotal);

  return {
    basic,
    hra,
    standardAllowance,
    performanceBonus,
    lta,
    fixedAllowance,
    pfEmployee,
    pfEmployer,
    professionalTax
  };
}
