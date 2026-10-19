import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
}

export const Table: React.FC<TableProps> = ({
  children,
  striped = false,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[#141F30]"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <table className={`w-full text-left text-xs border-collapse ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <thead
    className={`border-b border-[rgba(148,163,184,0.16)] bg-[#101827]/80 text-[#94A3B8] font-mono uppercase tracking-wider text-[11px] ${className}`}
    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
    {...props}
  >
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <tbody className={`divide-y divide-[rgba(148,163,184,0.1)] text-[#F1F5F9] ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <tr
    className={`transition-colors hover:bg-[#1B293B]/50 ${className}`}
    {...props}
  >
    {children}
  </tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <th className={`py-3.5 px-4 font-semibold ${className}`} {...props}>
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <td className={`py-3 px-4 ${className}`} {...props}>
    {children}
  </td>
);
