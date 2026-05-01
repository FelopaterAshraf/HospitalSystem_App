import Sidebar from './Sidebar';

// The 'children' prop is whatever page React Router tells us to render inside this layout
export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-brand-light font-sans">
            <Sidebar />
            
            {/* The main content area. We add a left margin of 64 (16rem) so it doesn't hide behind the fixed sidebar */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}