const Empty = ({
  iconSrc,
  title,
  subtitle,
}: {
  iconSrc?: string;
  title?: string;
  subtitle?: string;
}) => {
  return (
    <div className="h-96 flex flex-col items-center justify-center">
      <img src={iconSrc} className="w-60" />
      <div className="w-3/4 text-center flex flex-col gap-2">
        <p className="text-3xl font-semibold">{title}</p>
        <p className="text-muted-foreground ">{subtitle}</p>
      </div>
    </div>
  );
};
export default Empty;
