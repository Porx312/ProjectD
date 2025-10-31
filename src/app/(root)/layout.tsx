import Header from "./_components/Header";

export default function layout(  {children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-4">
        <Header />

          {children}
      </div>
    </div>
  );
}
