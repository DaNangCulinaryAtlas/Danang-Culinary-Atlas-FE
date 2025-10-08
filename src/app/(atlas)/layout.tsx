import Header from "@/components/navbar/parent";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
       <Header />
       <div >
          {children}
       </div>
    </>
 )
}