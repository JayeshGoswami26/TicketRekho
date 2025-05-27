// import { Coupon } from '../types/Coupon';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'upcoming';
  usageLimit: number;
  usageCount: number;
  minPurchase?: number;
  maxDiscount?: number;
}

export const coupons: Coupon[] = [
  {
    id: '1',
    code: 'SUMMER2025',
    description: 'Summer special discount on all movie tickets',
    discountType: 'percentage',
    discountValue: 20,
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'upcoming',
    usageLimit: 1000,
    usageCount: 0,
    minPurchase: 50,
    maxDiscount: 200
  },
  {
    id: '2',
    code: 'MOVIE50',
    description: '50% off on your first movie booking',
    discountType: 'percentage',
    discountValue: 50,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    usageLimit: 500,
    usageCount: 123,
    minPurchase: 100,
    maxDiscount: 300
  },
  {
    id: '3',
    code: 'EVENT100',
    description: 'Flat ₹100 off on event tickets',
    discountType: 'fixed',
    discountValue: 100,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: 'active',
    usageLimit: 200,
    usageCount: 45,
    minPurchase: 200
  },
  // Add more sample coupons...
];