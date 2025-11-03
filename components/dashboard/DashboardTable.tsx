/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export interface Column {
    title: string;
    key?: string;
    className?: string;
    sortable?: boolean;
    searchable?: boolean;
    searchItems?: { key: string; value: string }[];
    render?: (value: any, row: any) => React.ReactNode;
}

interface Props {
    columns: Column[];
    data: any[];
    loading?: boolean;
    skeletonCount?: number;
}

export const dateFormat = 'jYYYY/jMM/jDD';

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

const getValueByKey = (obj: any, path?: string) => {
    if (!path) return undefined;
    const parts = path.split('_');
    let acc = obj;
    for (const part of parts) {
        if (acc == null) return undefined;
        acc = acc[part];
    }
    return acc;
};


const DashboardTable = ({ columns, data, loading, skeletonCount = 3 }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [localFilters, setLocalFilters] = useState<Record<string, string>>({});
    const debounceTimer = useRef<number | null>(null);

    const updateQuery = (params: Record<string, string | null>) => {
        const newParams = new URLSearchParams(searchParams.toString());
        Object.entries(params).forEach(([key, value]) => {
            if (!key) return;
            if (value === null || value === '') newParams.delete(key);
            else newParams.set(key, value);
        });
        router.replace(`?${newParams.toString()}`);
    };

    const handleSort = (key: string) => {
        if (!key) return;

        const currentSort = searchParams.get('sortBy') || '';
        const isAsc = currentSort === key;
        const newSort = isAsc ? `-${key}` : key;

        updateQuery({ sortBy: newSort });
    };

    const handleSearchChange = (key: string, value: string) => {
        if (!key) return;
        setLocalFilters(prev => ({ ...prev, [key]: value }));

        if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
        debounceTimer.current = window.setTimeout(() => {
            updateQuery({ [key]: value || null, page: '1' });
        }, 500);
    };

    useEffect(() => {
        return () => {
            if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
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
                                onClick={() => col.sortable && handleSort(col.key as string)}
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
                        {columns.map(col => {
                            const filterValue =
                                localFilters[col.key ?? ''] ??
                                searchParams.get(col.key ?? '') ??
                                '';

                            return (
                                <TableCell key={col.key ?? col.title}>
                                    {col.searchable && !col.searchItems ? (
                                        <Input
                                            placeholder="جستجو"
                                            value={filterValue}
                                            onChange={e => handleSearchChange(col.key as string, e.target.value)}
                                            className="h-8 text-xs outline-none border border-[#efefef]"
                                        />
                                    ) : null}


                                    {/* Dropdown filter */}
                                    {col.searchItems ? (
                                        <div className="space-y-1">
                                            <Select
                                                value={filterValue}
                                                onValueChange={(val) =>
                                                    handleSearchChange(col.key as string, val)
                                                }>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className='bg-white'>
                                                    {col.searchItems.map((option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                            className='cursor-pointer hover:bg-[#efefef] justify-end'>
                                                            {option.key}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ) : null}
                                </TableCell>
                            )
                        })}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loading
                        ? renderSkeletonRows(skeletonCount, columns)
                        : data.length > 0
                            ? data.map((row, i) => (
                                <TableRow key={i}>
                                    {columns.map(col => {
                                        // get value safely (supports nested key with dot notation)
                                        const value = getValueByKey(row, col.key);
                                        // if a render function is provided, prefer it and pass both value & full row
                                        if (col.render) return <TableCell key={col.key ?? `${i}-${col.title}`}>{col.render(value, row)}</TableCell>;
                                        // otherwise show the primitive value (or '-' when missing)
                                        const display = value === undefined || value === null ? '-' : String(value);
                                        return <TableCell key={col.key ?? `${i}-${col.title}`}>{display}</TableCell>;
                                    })}
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
    );
};

export default DashboardTable;