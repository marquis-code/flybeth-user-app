/**
 * Field normalisation for car search results.
 *
 * Two different shapes reach the user app:
 *
 *  1. Platform ("flybeth") cars — the flat shape produced by
 *     `CarsService.normalizeCar()`: `name`, `category`, `transmission`,
 *     `fuelType`, `seats`, `luggage`, `image`, `freeCancellation` and the
 *     customer-facing `price` / `priceWithCommission` / `pricing.total` (total
 *     for the whole rental period) plus `pricing.basePrice` (customer per day).
 *     `dailyRate`, `netTotal` and `pricing.baseRate` are NET supplier figures
 *     and must never be shown to the customer.
 *
 *  2. Live provider cars (Duffel / Booking.com) — `CarSearchResult`:
 *     `vehicle.{name,type,transmission,fuelType,passengers,bagsLarge,images}`
 *     and `price.{amount,totalAmount,currency}`, plus `bookingInfo.rateKey`.
 *
 * Every value the UI reads goes through one of these helpers so a missing
 * field can never render as `NaN` / `undefined` / a bogus `$0`.
 */

/** Coerces anything to a finite number, defaulting to 0. */
export const carNumber = (value: any): number => {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? ''))
  return Number.isFinite(n) ? n : 0
}

/**
 * Total price of the whole rental period — always the CUSTOMER-facing number.
 *
 * Platform ("flybeth") cars publish `price` / `priceWithCommission` /
 * `pricing.total` as the customer total, while `dailyRate`, `netTotal` and
 * `pricing.baseRate` are NET supplier figures that must never be displayed.
 * Live provider cars publish the supplier total under `price.totalAmount`;
 * their customer figure (commission applied) is `priceWithCommission`, which is
 * why it is preferred first.
 */
export const carTotalPrice = (car: any): number => {
  if (!car) return 0
  return (
    carNumber(car.priceWithCommission) ||
    carNumber(car.price?.totalAmount) ||
    carNumber(car.pricing?.total) ||
    (typeof car.price === 'number' ? carNumber(car.price) : 0) ||
    carNumber(car.price?.amount) ||
    0
  )
}

/**
 * Customer-facing price per day. `pricing.basePrice` is the customer per-day
 * figure; when a provider only publishes a total we derive the day rate from
 * the rental length so a priced car never normalises to 0.
 *
 * NOTE: `dailyRate` / `pricing.baseRate` / `netTotal` are NET supplier figures
 * and are deliberately NOT used here.
 */
export const carCustomerDailyPrice = (car: any): number => {
  if (!car) return 0
  const perDay = carNumber(car.pricing?.basePrice)
  if (perDay > 0) return perDay
  const total = carTotalPrice(car)
  if (total <= 0) return 0
  const days = carNumber(car.rentalDays) || 1
  return Math.round((total / Math.max(1, days)) * 100) / 100
}

/** ISO date pair -> rental length in days (minimum 1). */
export const rentalDays = (pickUpDate?: string, dropOffDate?: string): number => {
  if (!pickUpDate || !dropOffDate) return 1
  const from = new Date(pickUpDate).getTime()
  const to = new Date(dropOffDate).getTime()
  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) return 1
  return Math.max(1, Math.round((to - from) / 86400000))
}

export const carName = (car: any): string =>
  car?.name || car?.vehicle?.name || 'Rental car'

export const carCategory = (car: any): string =>
  car?.category || car?.vehicle?.type || ''

export const carTransmission = (car: any): string =>
  car?.transmission || car?.vehicle?.transmission || car?.specifications?.transmission || ''

export const carFuelType = (car: any): string =>
  car?.fuelType || car?.vehicle?.fuelType || car?.specifications?.fuelType || ''

export const carImage = (car: any): string =>
  car?.image || car?.images?.[0] || car?.vehicle?.images?.[0] || ''

export const carSeats = (car: any): number =>
  carNumber(car?.seats ?? car?.capacity?.passengers ?? car?.vehicle?.passengers) || 4

export const carBags = (car: any): number =>
  carNumber(car?.luggage ?? car?.bags ?? car?.capacity?.luggage ?? car?.vehicle?.bagsLarge) || 2

/**
 * `true` when the result advertises free cancellation, `false` when it is
 * explicitly non-refundable and `undefined` when the provider says nothing.
 * Filters must treat `undefined` as "unknown" instead of excluding the car.
 */
export const carFreeCancellation = (car: any): boolean | undefined => {
  const value =
    car?.freeCancellation ??
    car?.freeCancellationAvailable ??
    car?.cancellation?.refundable ??
    car?.bookingInfo?.cancellation?.refundable
  if (value === true || value === false) return value
  if (value === 'true' || value === 'TRUE') return true
  if (value === 'false' || value === 'FALSE') return false
  return undefined
}

/**
 * Case-insensitive membership test for the sidebar filters. The backend stores
 * `transmission: 'automatic'` / `fuelType: 'petrol'` while the chips are
 * labelled `Automatic` / `Petrol`, so a plain `includes()` never matched.
 */
export const carMatchesAny = (value: any, selected: string[]): boolean =>
  selected.length === 0 ||
  (!!value && selected.some((s) => String(s).toLowerCase() === String(value).toLowerCase()))
