import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="canvas" style={{ alignItems: 'center', padding: '20px 0' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="glass-wrapper">
        <Sidebar />
        <main className="main-stage">{children}</main>
      </div>
    </div>
  );
}
