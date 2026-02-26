// =========================================================
// 1. CONFIGURATION
// =========================================================
const SUPABASE_URL = 'https://fllgcdidreolzabsnkrh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbGdjZGlkcmVvbHphYnNua3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNjczMDgsImV4cCI6MjA4NzY0MzMwOH0.R3TWhFg7aflUivMHI7V9LHl_2e1wpOcTRWZnfO15qSA'; // Your key
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// =========================================================
// 2. DOM ELEMENTS
// =========================================================
const elements = {
    empId:      document.getElementById('employee-id'), // Changed from username
    password:   document.getElementById('password'),
    confirm:    document.getElementById('confirm-password'),
    registerBtn: document.getElementById('register-btn'),
    errorMsg:   document.getElementById('register-error-msg')
};

// =========================================================
// 3. REGISTRATION LOGIC
// =========================================================

async function handleRegister() {
    const id = elements.empId.value.trim();
    const pass = elements.password.value;
    const conf = elements.confirm.value;

    // Reset UI
    elements.errorMsg.textContent = "";
    
    // Basic Checks
    if (!id || !pass || !conf) {
        showError("Please fill in all fields.");
        return;
    }

    if (pass !== conf) {
        showError("Passwords do not match.");
        return;
    }

    setLoading(true);

    try {
        // Step A: Check if Employee ID already exists
        const { data: existingUser } = await supabaseClient
            .from('users')
            .select('employee_id')
            .eq('employee_id', id)
            .single();

        if (existingUser) {
            throw new Error("This Employee ID is already registered.");
        }

        // Step B: Insert into our custom 'users' table
        // No email required!
        const { error } = await supabaseClient
            .from('users')
            .insert([
                { employee_id: id, password: pass } 
            ]);

        if (error) throw error;

        // Success
        alert("Registration Successful! Redirecting...");
        window.location.href = "login.html";

    } catch (err) {
        showError(err.message);
    } finally {
        setLoading(false);
    }
}

// =========================================================
// 4. HELPERS
// =========================================================

function showError(text) {
    elements.errorMsg.textContent = text;
    elements.errorMsg.style.color = "#ff4d4d";
}

function setLoading(active) {
    elements.registerBtn.disabled = active;
    elements.registerBtn.innerText = active ? "Processing..." : "Register";
}

elements.registerBtn.addEventListener('click', handleRegister);