/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';

export interface Column {
    title: string;
    key: string;
    className?: string;
    sortable?: boolean;
    searchable?: boolean;
    render?: (value: any, row: any) => React.ReactNode;
}

interface Props {
    columns: Column[];
    data: any[];
    loading?: boolean;
    skeletonCount?: number;
}

export const renderSkeletonRows = (count: number, COLUMNS: Column[]) => {
    return Array.from({ length: count }).map((_, idx) => (
        <TableRow key={`skeleton-${idx}`}>
            {COLUMNS.map((_, colIdx) => (
                <TableCell key={colIdx}>
                    <Skeleton className="h-6 w-full" />
                </TableCell>
            ))}
        </TableRow>
    ));
};

const DashboardTable = ({ columns, data, loading, skeletonCount = 3 }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [localFilters, setLocalFilters] = useState<Record<string, string>>({});
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const updateQuery = (params: Record<string, string | null>) => {
        const newParams = new URLSearchParams(searchParams.toString());
        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === '') newParams.delete(key);
            else newParams.set(key, value);
        });
        router.replace(`?${newParams.toString()}`);
    };

    const handleSort = (key: string) => {
        const currentSort = searchParams.get('sort');
        const currentDir = searchParams.get('dir') || 'asc';

        let newDir: 'asc' | 'desc' = 'asc';
        if (currentSort === key && currentDir === 'asc') newDir = 'desc';

        updateQuery({ sort: key, dir: newDir });
    };

    const handleSearchChange = (key: string, value: string) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));

        // debounce query updates
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            updateQuery({ [key]: value, page: '1' });
        }, 500); // ⏱ debounce delay (ms)
    };

    useEffect(() => {
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, []);

    return (
        <div className="space-y-4 overflow-x-auto">
            <Table>
                <TableHeader>
                    {/* Sortable headers */}
                    <TableRow>
                        {columns.map(col => (
                            <TableHead
                                key={col.title}
                                className={cn(
                                    'min-w-24',
                                    col.className,
                                    col.sortable && 'cursor-pointer select-none'
                                )}
                                onClick={() => col.sortable && handleSort(col.key)}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{col.title}</span>
                                    {col.sortable && <ArrowUpDown size={14} className="ml-1" />}
                                </div>
                            </TableHead>
                        ))}
                    </TableRow>

                    {/* Search row */}
                    <TableRow>
                        {columns.map(col => (
                            <TableCell key={col.key}>
                                {col.searchable ? (
                                    <Input
                                        placeholder={`جستجو ${col.title}...`}
                                        value={localFilters[col.key] ?? searchParams.get(col.key) ?? ''}
                                        onChange={e => handleSearchChange(col.key, e.target.value)}
                                        className="h-8 text-xs outline-none border border-[#efefef]"
                                    />
                                ) : null}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loading
                        ? renderSkeletonRows(skeletonCount, columns)
                        : data.length > 0 ? (
                            data.map((row, i) => (
                                <TableRow key={i}>
                                    {columns.map(col => (
                                        <TableCell key={col.key}>
                                            {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '-')}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center text-gray-500">
                                    هیچ داده‌ای یافت نشد.
                                </TableCell>
                            </TableRow>
                        )}
                </TableBody>
            </Table>
        </div>
    );
};

export default DashboardTable;