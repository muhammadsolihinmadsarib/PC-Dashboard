document.addEventListener('DOMContentLoaded', () => {
    const SUPABASE_URL = 'https://fllgcdidreolzabsnkrh.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbGdjZGlkcmVvbHphYnNua3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNjczMDgsImV4cCI6MjA4NzY0MzMwOH0.R3TWhFg7aflUivMHI7V9LHl_2e1wpOcTRWZnfO15qSA';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const elements = {
        empIdInput: document.getElementById('employee-id'),
        passwordInput: document.getElementById('password'),
        loginBtn: document.getElementById('login-btn'),
        errorMsg: document.getElementById('error-msg')
    };

    elements.loginBtn.addEventListener('click', async () => {
        const id = elements.empIdInput.value.trim();
        const pass = elements.passwordInput.value;

        if (!id || !pass) {
            elements.errorMsg.textContent = 'Please enter Employee ID and password';
            return;
        }

        elements.loginBtn.disabled = true;
        elements.loginBtn.textContent = "Checking...";

        try {
            const { data, error } = await supabaseClient
                .from('users')
                .select('*')
                .eq('employee_id', id)
                .eq('password', pass)
                .single();

            if (error || !data) throw new Error("Invalid Employee ID or Password");

            // Store session
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentEmployee', id);

            // Log the Login Event
            await supabaseClient.from('activity_logs').insert([
                { employee_id: id, action: 'LOGIN', details: 'User logged into the system' }
            ]);

            window.location.href = 'index.html';
        } catch (err) {
            elements.errorMsg.textContent = err.message;
        } finally {
            elements.loginBtn.disabled = false;
            elements.loginBtn.textContent = "Login";
        }
    });
});