function DashboardLayout({ sidebar, topbar, children }) {
  return (
    <div className="min-h-screen flex bg-[#FFF8F5] text-[#171717]">

      {/* Sidebar */}
      {sidebar}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Topbar */}
        {topbar}

        {/* Page Content */}
        <main className="flex-1 p-8 bg-[#FFF8F5]">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;