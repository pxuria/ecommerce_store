import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';

interface Props {
    columns: { title: string; className?: string; }[];
    children: React.ReactNode;
}

export const renderSkeletonRows = (count: number, COLUMNS: { title: string }[]) => {
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

const DashboardTable = ({ columns, children }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map(item => (
                        <TableHead key={item.title} className={`${item.className}`}>{item.title}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {children}
            </TableBody>
        </Table>
    )
}

export default DashboardTable