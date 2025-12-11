'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { UniqueOptions } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface FiltersProps {
  options: UniqueOptions;
}

export function Filters({ options }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelectChange = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (!value) {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  }

  const hasFilters = searchParams.size > 0;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Select
        onValueChange={(value) => handleSelectChange('offerType', value)}
        value={searchParams.get('offerType') || ''}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Offer Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Offer Types</SelectItem>
          {options.offerType.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => handleSelectChange('discountBucket', value)}
        value={searchParams.get('discountBucket') || ''}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Discount Bucket" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Discounts</SelectItem>
          {options.discountBucket.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => handleSelectChange('product', value)}
        value={searchParams.get('product') || ''}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Product" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Products</SelectItem>
          {options.product.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => handleSelectChange('region', value)}
        value={searchParams.get('region') || ''}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Regions</SelectItem>
          {options.region.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && <Button variant="ghost" onClick={clearFilters}>Clear Filters</Button>}
    </div>
  );
}
