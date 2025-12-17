'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils'; // 前回のSTEPで作った関数

export function FilterTabs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentType = searchParams.get('type') || 'all';

  const handleFilter = (type: string) => {
    const params = new URLSearchParams(searchParams);
    if (type === 'all') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'original', label: 'Original' },
    { id: 'cover', label: 'Cover' },
  ];

  return (
    <div className="flex p-1 bg-gray-100 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleFilter(tab.id)}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
            currentType === tab.id
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}