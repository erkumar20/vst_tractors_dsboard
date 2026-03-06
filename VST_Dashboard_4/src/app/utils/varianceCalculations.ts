import type { VarianceData } from "../data/mockData";

/**
 * Calculate variance and status based on actual vs planned allocation
 * 
 * Rules:
 * - Alert (high): actualAllocation > plannedAllocation (exceeded)
 * - Warning (medium): actualAllocation >= 90% of plannedAllocation AND <= plannedAllocation
 * - Healthy (low): actualAllocation < 90% of plannedAllocation
 * 
 * Variance = plannedAllocation - actualAllocation
 */
export function calculateVarianceAndStatus(
  plannedAllocation: number,
  actualAllocation: number
): { variance: number; status: 'high' | 'medium' | 'low' } {
  const variance = plannedAllocation - actualAllocation;
  const threshold90Percent = plannedAllocation * 0.9;
  
  let status: 'high' | 'medium' | 'low';
  
  if (actualAllocation > plannedAllocation) {
    // Exceeded planned allocation - Alert
    status = 'high';
  } else if (actualAllocation >= threshold90Percent) {
    // Between 90-100% of planned allocation - Warning
    status = 'medium';
  } else {
    // Below 90% of planned allocation - Healthy
    status = 'low';
  }
  
  return { variance, status };
}

/**
 * Update variance data array with recalculated variance and status
 */
export function updateVarianceData(data: VarianceData[]): VarianceData[] {
  return data.map(row => {
    const { variance, status } = calculateVarianceAndStatus(
      row.plannedAllocation,
      row.actualAllocation
    );
    return {
      ...row,
      variance,
      status,
    };
  });
}