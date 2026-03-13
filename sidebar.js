document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('currentEmployee');
    
    // 1. Create the Toggle Button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'menu-toggle';
    toggleBtn.innerHTML = '<div><span class="bar"></span><span class="bar"></span><span class="bar"></span></div>';
    toggleBtn.onclick = () => document.getElementById('sidebar').classList.toggle('collapsed');
    document.body.appendChild(toggleBtn);

    // 2. Create the Sidebar HTML
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    sidebar.className = 'collapsed'; // Hidden by default
    sidebar.innerHTML = `
        <div class="logo-area">
            PC DEPLOYMENT<br>
            <span style="font-size: 0.8rem; color: #bdc3c7;">IT SUPPORT DASHBOARD</span>
            <div id="sidebar-user-display">Login as: ${user || 'Unknown'}</div>
        </div>
        <nav id="main-nav">
            <a href="index.html">Main Dashboard</a>
            <a href="logs.html">View PC Logs</a>
            <a href="#" id="sidebar-logout-link" style="color: #e74c3c !important; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 10px;">Logout</a>
        </nav>
    `;
    document.body.appendChild(sidebar);

    // 3. Handle Logout Function
    document.getElementById('sidebar-logout-link').onclick = async (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to logout?")) {
            // If the main script.js is loaded, it will use its logActivity function
            if (typeof logActivity === "function") {
                await logActivity("LOGOUT", "User signed out via sidebar");
            }
            localStorage.clear();
            window.location.replace('login.html');
        }
    };
});