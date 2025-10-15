import Footer from "@/components/footer";
import Header from "@/components/navbar/parent";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
       <Header />
       <div className="min-h-screen">
          <div className="h-14"/> {/* Spacer */}
          {children}
       </div>
       <Footer />
    </>
 )
}