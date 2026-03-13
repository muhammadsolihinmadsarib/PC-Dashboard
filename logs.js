// ================= SUPABASE INIT =================
const { createClient } = supabase;

const supabaseClient = createClient(
  'https://fllgcdidreolzabsnkrh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbGdjZGlkcmVvbHphYnNua3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNjczMDgsImV4cCI6MjA4NzY0MzMwOH0.R3TWhFg7aflUivMHI7V9LHl_2e1wpOcTRWZnfO15qSA'
);

// ================= AUTH CHECK =================
const isLoggedIn = localStorage.getItem('isLoggedIn');
if (isLoggedIn !== 'true') {
    window.location.replace('login.html');
}

// ================= DOM ELEMENTS =================
const logsBody = document.getElementById('logsBody');

// ================= LOAD LOGS =================
async function loadLogs() {
    if (!logsBody) return;

    const { data, error } = await supabaseClient
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error loading logs:", error);
        alert("Failed to load activity logs");
        return;
    }

    // Clear loading text
    logsBody.innerHTML = '';

    // If no logs found
    if (data.length === 0) {
        logsBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No activities recorded yet.</td></tr>';
        return;
    }

    // Populate Table
    data.forEach(log => {
        const row = logsBody.insertRow();
        const logDate = new Date(log.created_at);
        
        // --- SEPARATE DATE AND TIME ---
        // Date format: 27 Feb 2026
        const dateStr = logDate.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });

        // Time format: 09:07
        const timeStr = logDate.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });

        // --- MATCHING THE TABLE COLUMNS ---
        // Column Order: Date | Time | Employee ID | Action | Details
        row.innerHTML = `
            <td style="color: #666; font-size: 13px;">${dateStr}</td>
            <td style="color: #666; font-size: 13px;">${timeStr}</td>
            <td><span class="badge-emp">${log.employee_id}</span></td>
            <td><span class="action-tag ${log.action.toLowerCase()}">${log.action}</span></td>
            <td style="color: #444; font-size: 13px; text-align: left;">${log.details}</td>
        `;
    });
}

// ================= INITIALIZE =================
document.addEventListener('DOMContentLoaded', loadLogs);

// ================= AUTO REFRESH =================
// Refresh the logs every 30 seconds to show new activity
setInterval(loadLogs, 30000);