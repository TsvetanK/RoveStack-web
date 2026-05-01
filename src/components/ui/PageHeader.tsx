interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="page-header">
      <h1 className="display page-header-title">{title}</h1>
      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
    </div>
  );
}
