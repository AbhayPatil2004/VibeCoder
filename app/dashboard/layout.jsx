import { SidebarProvider } from '@/components/ui/sidebar'
import { getAllPlayground } from "../../modules/dashboard/actions/index.js"
import { DashboardSidebar } from '../../modules/dashboard/components/dashboard-sidebar.jsx'

export default async function DashboardLayout({ children }) {

    const playgroundData = await getAllPlayground()

    const technologyIconMap = {
        REACT: "Zap",
        NEXTJS: "Lightbulb",
        EXPRESS: "Database",
        VUE: "Compass",
        HONO: "FlameIcon",
        ANGULAR: "Terminal",
    }

    const formattedPlaygroundData = playgroundData?.map((item) => ({
        id: item.id,
        name: item.title,
        starred: item.Starmark?.[0]?.isMarked || false,
        icon: technologyIconMap[item.template] || "Code2"
    }))

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full overflow-x-hidden">
                <DashboardSidebar initialPlaygroundData={formattedPlaygroundData}></DashboardSidebar>
                <main className="flex-1">
                    
                    {children}
                </main>

            </div>
        </SidebarProvider>
    )
}