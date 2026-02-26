// Ensure the script runs only after HTML is fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // ================= CONFIGURATION =================
    const SUPABASE_URL = 'https://fllgcdidreolzabsnkrh.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbGdjZGlkcmVvbHphYnNua3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNjczMDgsImV4cCI6MjA4NzY0MzMwOH0.R3TWhFg7aflUivMHI7V9LHl_2e1wpOcTRWZnfO15qSA'; // Your key
    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

    // ================= DOM ELEMENTS =================
    // Ensure these IDs match your HTML exactly!
    const elements = {
        empIdInput:  document.getElementById('employee-id'), 
        passwordInput: document.getElementById('password'),
        loginBtn:      document.getElementById('login-btn'),
        errorMsg:      document.getElementById('error-msg')
    };

    // ================= LOGIN LOGIC =================
    elements.loginBtn.addEventListener('click', async () => {
        const id = elements.empIdInput.value.trim();
        const pass = elements.passwordInput.value;

        // Reset error message
        elements.errorMsg.textContent = '';

        if (!id || !pass) {
            elements.errorMsg.textContent = 'Please enter Employee ID and password';
            return;
        }

        // Disable button while checking
        elements.loginBtn.disabled = true;
        elements.loginBtn.textContent = "Checking...";

        try {
            // Check the 'users' table for a match
            const { data, error } = await supabaseClient
                .from('users')
                .select('*')
                .eq('employee_id', id)
                .eq('password', pass) // Direct comparison
                .single();

            if (error || !data) {
                throw new Error("Invalid Employee ID or Password");
            }

            // SUCCESS: Store the session locally so the dashboard knows who is logged in
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentEmployee', id);

            // Redirect to your PC tracking dashboard
            window.location.href = 'index.html';

        } catch (err) {
            elements.errorMsg.textContent = err.message;
            elements.errorMsg.style.color = "red";
        } finally {
            elements.loginBtn.disabled = false;
            elements.loginBtn.textContent = "Login";
        }
    });
});