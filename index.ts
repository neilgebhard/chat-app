const formatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
})

type divisionType = {
  amount: number
  name: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
}

const DIVISIONS: divisionType[] = [
  { amount: 60, name: 'second' },
  { amount: 60, name: 'minute' },
  { amount: 24, name: 'hour' },
  { amount: 7, name: 'day' },
  { amount: 4.34524, name: 'week' },
  { amount: 12, name: 'month' },
  { amount: Number.POSITIVE_INFINITY, name: 'year' },
]

export function formatTimeAgo(date: string) {
  let duration = (Number(new Date(date)) - Number(new Date())) / 1000

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i]
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name)
    }
    duration /= division.amount
  }
}
