// Calculate percentage change
export const calculateTrend = (data: { value: number }[]) => {
    const lastMonth = data[data.length - 1].value
    const previousMonth = data[data.length - 2].value
    const change = ((lastMonth - previousMonth) / previousMonth) * 100
    return change.toFixed(1)
  }
  