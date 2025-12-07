"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Store, Clock, Flag, Loader2 } from "lucide-react"
import { adminColors } from "@/configs/colors"
import { useAdminOverview } from "@/hooks/queries/useAdminOverview"
import RestaurantDistributionChart from "@/components/admin/RestaurantDistributionChart"

export default function AdminDashboard() {
  const { data: overview, isLoading, error } = useAdminOverview()

  // Tính tổng tài khoản
  const totalAccounts = overview
    ? overview.totalUserAccounts + overview.totalVendorAccounts
    : 0

  const metrics = [
    {
      title: "Tổng tài khoản",
      value: isLoading ? "..." : totalAccounts.toLocaleString('vi-VN'),
      icon: Users,
      description: "User & Vendor",
      detail: overview ? `${overview.totalUserAccounts} Users, ${overview.totalVendorAccounts} Vendors` : "",
    },
    {
      title: "Quán ăn đã duyệt",
      value: isLoading ? "..." : (overview?.totalApprovedRestaurants || 0).toLocaleString('vi-VN'),
      icon: Store,
      description: "Đang hoạt động",
    },
    {
      title: "Quán chờ duyệt",
      value: isLoading ? "..." : (overview?.totalPendingRestaurants || 0).toLocaleString('vi-VN'),
      icon: Clock,
      description: "Cần xét duyệt",
    },
    {
      title: "Báo cáo vi phạm / Reports",
      value: "23",
      icon: Flag,
      description: "Chưa xử lý / Pending",
    },
  ]
  const metricColors = [
    {
      bg: adminColors.gradients.primary,
      iconBg: adminColors.gradients.primarySoft,
      value: adminColors.primary[600],
      border: adminColors.primary[200],
      text: adminColors.primary[700]
    },
    {
      bg: `linear-gradient(135deg, ${adminColors.accent.emerald}, #059669, #047857)`,
      iconBg: `linear-gradient(135deg, #34D399, ${adminColors.accent.emerald})`,
      value: '#047857',
      border: '#A7F3D0',
      text: adminColors.accent.emerald
    },
    {
      bg: `linear-gradient(135deg, ${adminColors.accent.amber}, #D97706, #B45309)`,
      iconBg: `linear-gradient(135deg, #FBBF24, ${adminColors.accent.amber})`,
      value: '#B45309',
      border: '#FDE68A',
      text: adminColors.accent.amber
    },
    {
      bg: `linear-gradient(135deg, ${adminColors.status.error}, #DC2626, #B91C1C)`,
      iconBg: `linear-gradient(135deg, #F87171, ${adminColors.status.error})`,
      value: '#B91C1C',
      border: '#FECACA',
      text: adminColors.status.error
    },
  ]

  return (
    <div className="space-y-8">
      <div
        className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-white shadow-2xl"
        style={{ background: adminColors.gradients.primary }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-15"></div>
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 drop-shadow-sm">Tổng quan</h1>
          <p className="text-lg md:text-xl font-medium" style={{ color: adminColors.primary[200] }}>
            Cái nhìn toàn cảnh về tình hình hoạt động của hệ thống
          </p>
          {error && (
            <div className="mt-4 px-4 py-2 bg-red-500/20 border border-red-300 rounded-lg">
              <p className="text-sm">⚠️ Không thể tải dữ liệu tổng quan</p>
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const colors = metricColors[index % metricColors.length]

          return (
            <Card
              key={metric.title}
              className="overflow-hidden border-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white backdrop-blur-sm group"
              style={{ borderColor: colors.border }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-6 pt-6">
                <CardTitle className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  {metric.title}
                </CardTitle>
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-white transition-transform group-hover:scale-110"
                  style={{ background: colors.iconBg }}
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <Icon className="h-6 w-6 text-white" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight" style={{ color: colors.value }}>
                  {metric.value}
                </div>
                <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
                  {metric.description}
                </p>
                {metric.detail && (
                  <p className="text-xs text-gray-400 font-medium">
                    {metric.detail}
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Chart Section - Phân bố loại hình quán ăn */}
      <Card
        className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white backdrop-blur-sm"
        style={{ borderColor: '#A7F3D0' }}
      >
        <CardHeader
          className="border-b"
          style={{
            background: 'linear-gradient(to right, #D1FAE5, rgba(209, 250, 229, 0.5), white)',
            borderColor: '#A7F3D0'
          }}
        >
          <CardTitle className="font-bold text-lg" style={{ color: '#059669' }}>
            Phân bố loại hình quán ăn
          </CardTitle>
          <CardDescription className="font-semibold" style={{ color: adminColors.accent.emerald }}>
            Biểu đồ tròn dựa trên Loại món ăn
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <RestaurantDistributionChart />
        </CardContent>
      </Card>
    </div>
  )
}

