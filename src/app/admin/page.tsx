"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Store, Clock, Flag, TrendingUp, TrendingDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { adminColors } from "@/configs/colors"

// Mock data - sẽ được thay thế bằng API calls
const metrics = [
  {
    title: "Tổng người dùng",
    value: "12,543",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "User & Vendor",
  },
  {
    title: "Tổng quán ăn",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: Store,
    description: "Đang hoạt động",
  },
  {
    title: "Yêu cầu chờ duyệt",
    value: "45",
    change: "-5.3%",
    trend: "down",
    icon: Clock,
    description: "Quán + Món ăn",
  },
  {
    title: "Báo cáo vi phạm",
    value: "23",
    change: "+15.0%",
    trend: "up",
    icon: Flag,
    description: "Chưa xử lý",
  },
]

const recentActivities = [
  {
    id: 1,
    action: "Vendor A vừa đăng ký quán mới",
    time: "5 phút trước",
    type: "restaurant",
  },
  {
    id: 2,
    action: "User B vừa gửi báo cáo",
    time: "12 phút trước",
    type: "report",
  },
  {
    id: 3,
    action: "Món ăn 'Bún Bò Huế' đã được duyệt",
    time: "1 giờ trước",
    type: "dish",
  },
  {
    id: 4,
    action: "Vendor C đã cập nhật thông tin quán",
    time: "2 giờ trước",
    type: "restaurant",
  },
  {
    id: 5,
    action: "User D đã đăng ký tài khoản mới",
    time: "3 giờ trước",
    type: "user",
  },
]

export default function AdminDashboard() {
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
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
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
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight" style={{ color: colors.value }}>
                  {metric.value}
                </div>
                <p className="text-xs text-gray-500 mb-4 font-semibold uppercase tracking-wide">
                  {metric.description}
                </p>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                  <TrendIcon
                    className="h-4 w-4"
                    style={{ color: metric.trend === "up" ? adminColors.status.success : adminColors.status.error }}
                  />
                  <span
                    className="text-xs font-bold"
                    style={{ color: metric.trend === "up" ? adminColors.status.success : adminColors.status.error }}
                  >
                    {metric.change} so với tháng trước
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section - Placeholder */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card 
          className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white backdrop-blur-sm"
          style={{ borderColor: adminColors.primary[200] }}
        >
          <CardHeader 
            className="border-b"
            style={{ 
              background: `linear-gradient(to right, ${adminColors.primary[50]}, rgba(230, 244, 248, 0.5), white)`,
              borderColor: adminColors.primary[200]
            }}
          >
            <CardTitle className="font-bold text-lg" style={{ color: adminColors.primary[600] }}>
              Lượng truy cập và đăng ký
            </CardTitle>
            <CardDescription className="font-semibold" style={{ color: adminColors.primary[400] }}>
              Biểu đồ đường theo thời gian
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div 
              className="h-[300px] flex items-center justify-center rounded-xl border-2 border-dashed transition-all hover:border-solid"
              style={{
                background: `linear-gradient(135deg, ${adminColors.primary[50]}, white, ${adminColors.primary[50]})`,
                borderColor: adminColors.primary[200]
              }}
            >
              <div className="text-center">
                <div className="text-5xl mb-3">📊</div>
                <p className="text-sm font-semibold" style={{ color: adminColors.primary[500] }}>
                  Biểu đồ đường - Cần tích hợp thư viện chart
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
              Biểu đồ tròn dựa trên RestaurantTag
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div 
              className="h-[300px] flex items-center justify-center rounded-xl border-2 border-dashed transition-all hover:border-solid"
              style={{
                background: 'linear-gradient(135deg, rgba(209, 250, 229, 0.5), white, rgba(209, 250, 229, 0.3))',
                borderColor: '#A7F3D0'
              }}
            >
              <div className="text-center">
                <div className="text-5xl mb-3">🥧</div>
                <p className="text-sm font-semibold" style={{ color: adminColors.accent.emerald }}>
                  Biểu đồ tròn - Cần tích hợp thư viện chart
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card 
        className="border-2 shadow-xl bg-white backdrop-blur-sm overflow-hidden"
        style={{ borderColor: adminColors.primary[200] }}
      >
        <CardHeader 
          className="relative overflow-hidden text-white"
          style={{ background: adminColors.gradients.primary }}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-15"></div>
          <div className="relative">
            <CardTitle className="text-white text-xl font-bold drop-shadow-sm">Hoạt động gần đây</CardTitle>
            <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
              Danh sách 5 hành động gần nhất
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow 
                className="hover:bg-transparent border-b"
                style={{ 
                  background: adminColors.primary[50], 
                  borderColor: adminColors.primary[200] 
                }}
              >
                <TableHead className="font-bold text-sm" style={{ color: adminColors.primary[600] }}>
                  Hành động
                </TableHead>
                <TableHead className="font-bold text-sm" style={{ color: adminColors.primary[600] }}>
                  Thời gian
                </TableHead>
                <TableHead className="font-bold text-sm" style={{ color: adminColors.primary[600] }}>
                  Loại
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity, index) => (
                <TableRow 
                  key={activity.id}
                  className="transition-all duration-200 border-b hover:shadow-sm"
                  style={{ borderColor: adminColors.primary[100] }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = adminColors.primary[50]
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <TableCell className="font-semibold text-gray-700 py-4">
                    {activity.action}
                  </TableCell>
                  <TableCell className="text-gray-500 py-4 font-medium">{activity.time}</TableCell>
                  <TableCell className="py-4">
                    <Badge 
                      className="font-semibold px-3 py-1 border shadow-sm"
                      style={{
                        background: `linear-gradient(to right, ${adminColors.primary[50]}, ${adminColors.primary[100]})`,
                        color: adminColors.primary[700],
                        borderColor: adminColors.primary[200]
                      }}
                    >
                      {activity.type}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

