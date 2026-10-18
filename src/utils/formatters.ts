/**
 * Utilities for formatting numbers and currencies in Bengali & English
 */

const BENGALI_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function toBengaliNumber(num: number | string): string {
  if (num === null || num === undefined) return '০';
  const str = num.toString();
  return str.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[digit] || digit);
}

export function formatTaka(amount: number, useBengaliDigits: boolean = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return useBengaliDigits ? '৳ ০' : '৳ 0';
  }
  
  // Format with standard commas (e.g. 10,970 or 1,500)
  const formattedStr = Math.round(amount).toLocaleString('en-IN');
  
  if (useBengaliDigits) {
    return `৳ ${toBengaliNumber(formattedStr)}`;
  }
  return `৳ ${formattedStr}`;
}

export function formatPieces(count: number, useBengaliDigits: boolean = true): string {
  if (isNaN(count)) return useBengaliDigits ? '০ পিস' : '0 পিস';
  const formatted = count.toLocaleString('en-IN');
  return useBengaliDigits ? `${toBengaliNumber(formatted)} পিস` : `${formatted} পিস`;
}

export function formatPercentage(pct: number, useBengaliDigits: boolean = true): string {
  if (isNaN(pct)) return useBengaliDigits ? '০.০%' : '0.0%';
  const fixed = pct.toFixed(1);
  return useBengaliDigits ? `${toBengaliNumber(fixed)}%` : `${fixed}%`;
}

export function formatBengaliDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    const months = [
      'জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'
    ];
    const monthName = months[parseInt(month, 10) - 1] || month;
    return `${toBengaliNumber(parseInt(day, 10))} ${monthName}, ${toBengaliNumber(year)}`;
  } catch {
    return dateStr;
  }
}
