document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const authMessage = document.getElementById('auth-message');
    const bankingSection = document.getElementById('banking-section');
    const balanceDisplay = document.getElementById('balance');
    const amountInput = document.getElementById('amount');
    const depositBtn = document.getElementById('deposit-btn');
    const withdrawBtn = document.getElementById('withdraw-btn');
    const operationMessage = document.getElementById('operation-message');

    let currentUser = null;

    // Register a new user
    registerBtn.addEventListener('click', async () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        authMessage.textContent = data.message;
        if (response.ok) {
            authMessage.textContent = 'Registration successful! Log in to continue.';
        }
    });

    // Login an existing user
    loginBtn.addEventListener('click', async () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        authMessage.textContent = data.message;
        if (response.ok) {
            currentUser = email;
            showBankingSection();
            updateBalance();
        }
    });

    // Deposit money
    depositBtn.addEventListener('click', async () => {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            operationMessage.textContent = 'Please enter a valid amount.';
            return;
        }
        const response = await fetch('/deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser, amount })
        });
        const data = await response.json();
        operationMessage.textContent = data.message;
        if (response.ok) {
            updateBalance();
        }
    });

    // Withdraw money
    withdrawBtn.addEventListener('click', async () => {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            operationMessage.textContent = 'Please enter a valid amount.';
            return;
        }
        const response = await fetch('/withdraw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser, amount })
        });
        const data = await response.json();
        operationMessage.textContent = data.message;
        if (response.ok) {
            updateBalance();
        }
    });

    // Logout ends the server session and returns to the login form.
    document.getElementById('logout-btn').addEventListener('click', async () => {
        const response = await fetch('/logout', { method: 'POST' });
        if (response.ok) {
            currentUser = null;
            bankingSection.style.display = 'none';
            document.getElementById('auth-section').style.display = 'block';
            passwordInput.value = '';
            authMessage.textContent = 'Logged out.';
        }
    });

    // Show banking section after login
    function showBankingSection() {
        document.getElementById('auth-section').style.display = 'none';
        bankingSection.style.display = 'block';
    }

    // Update balance display
    async function updateBalance() {
        const response = await fetch(`/balance?email=${currentUser}`);
        const data = await response.json();
        balanceDisplay.textContent = `$${data.balance.toFixed(2)} CAD`;
    }
});