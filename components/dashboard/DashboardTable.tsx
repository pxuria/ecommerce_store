/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-react';
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
    children: React.ReactNode;
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
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [searchFilters, setSearchFilters] = useState<Record<string, string>>({});

    const handleSort = (key: string) => {
        setSortConfig((prev) => {
            if (prev?.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    // Handle per-column search
    const handleSearchChange = (key: string, value: string) => {
        setSearchFilters((prev) => ({ ...prev, [key]: value }));
    };

    // Apply sorting + filtering
    const processedData = useMemo(() => {
        let filtered = [...data];

        // Apply search filters
        Object.entries(searchFilters).forEach(([key, value]) => {
            if (value.trim()) {
                filtered = filtered.filter((row) =>
                    String(row[key] ?? '').toLowerCase().includes(value.toLowerCase())
                );
            }
        });

        // Apply sorting
        if (sortConfig) {
            filtered.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                if (valA === valB) return 0;
                if (valA == null) return 1;
                if (valB == null) return -1;
                return sortConfig.direction === 'asc'
                    ? String(valA).localeCompare(String(valB))
                    : String(valB).localeCompare(String(valA));
            });
        }

        return filtered;
    }, [data, searchFilters, sortConfig]);

    return (
        <div className="space-y-4 overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map(col => (
                            <TableHead
                                key={col.title}
                                className={cn(col.className, col.sortable && 'cursor-pointer select-none')}
                                onClick={() => col.sortable && handleSort(col.key)}>
                                <div className="flex items-center justify-between">
                                    <span>{col.title}</span>
                                    {col.sortable && <ArrowUpDown size={14} className="ml-1" />}
                                </div>
                            </TableHead>
                        ))}
                    </TableRow>

                    {/* Search row */}
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell key={col.key}>
                                {col.searchable ? (
                                    <Input
                                        placeholder={`جستجو ${col.title}...`}
                                        value={searchFilters[col.key] || ''}
                                        onChange={(e) => handleSearchChange(col.key, e.target.value)}
                                        className="h-8 text-xs"
                                    />
                                ) : null}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loading
                        ? renderSkeletonRows(skeletonCount, columns)
                        : processedData.length > 0
                            ? processedData.map((row, i) => (
                                <TableRow key={i}>
                                    {columns.map((col) => (
                                        <TableCell key={col.key}>
                                            {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '-')}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                            : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center text-gray-500">
                                        هیچ داده‌ای یافت نشد.
                                    </TableCell>
                                </TableRow>
                            )}
                </TableBody>
            </Table>
        </div>
    )
}

export default DashboardTable