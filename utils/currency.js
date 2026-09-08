export const formatTsh = (value) => {
  const amount = Number(value) || 0

  return `TSh ${new Intl.NumberFormat('en-TZ', {
    maximumFractionDigits: 0,
  }).format(amount)}`
}
