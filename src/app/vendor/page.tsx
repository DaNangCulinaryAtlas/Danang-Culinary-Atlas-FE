"use client"

export default function VendorDashboard() {
    return (
        <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Welcome to Vendor Dashboard
                </h2>
                <p className="text-gray-600">
                    This is the vendor dashboard page. Only users with VENDOR role can access this page.
                </p>
            </div>
        </div>
    )
}
