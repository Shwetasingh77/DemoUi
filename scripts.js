document.addEventListener('DOMContentLoaded', function () {
    // Initialize Bootstrap Tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDarkTheme = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDarkTheme ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');

        if (document.getElementById('particles-js') && window.pJSDom && window.pJSDom[0]) {
            const particles = window.pJSDom[0].pJS.particles;
            const color = isDarkTheme ? '#A5B4FC' : '#1F2937';
            particles.color.value = color;
            particles.line_linked.color = color;
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    });

    // Particles.js for Hero Section
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: document.body.classList.contains('dark-theme') ? '#A5B4FC' : '#1F2937' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: document.body.classList.contains('dark-theme') ? '#A5B4FC' : '#1F2937',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }

    // Ensure navigation links work
    const navLinks = document.querySelectorAll('a[href]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('Link clicked:', link.href);
        });
    });

    // Form Handling: Register
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Debug: Confirm form is found
        console.log('Register form found:', registerForm);

        // Debug: Add click listener to the Register button
        const registerButton = registerForm.querySelector('button[type="submit"]');
        if (registerButton) {
            console.log('Register button found:', registerButton);
            registerButton.addEventListener('click', (e) => {
                console.log('Register button clicked');
            });
        } else {
            console.error('Register button not found in form');
        }

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Register form submitted');

            const spinner = document.getElementById('registerSpinner');
            const errorDiv = document.getElementById('registerError');
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value.toLowerCase();
            const password = document.getElementById('password').value;

            console.log('Register form data:', { username, email, password });

            spinner.classList.remove('d-none');
            errorDiv.textContent = '';

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.some(user => user.email === email)) {
                spinner.classList.add('d-none');
                errorDiv.textContent = 'Email already registered. Please login.';
                errorDiv.classList.add('text-danger');
                return;
            }

            users.push({ username, email, password });
            localStorage.setItem('users', JSON.stringify(users));

            setTimeout(() => {
                spinner.classList.add('d-none');
                errorDiv.textContent = 'Registration successful! Redirecting to login...';
                errorDiv.classList.remove('text-danger');
                errorDiv.classList.add('text-success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }, 1000);
        });
    } else {
        console.error('Register form not found');
    }

    // Form Handling: Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const spinner = document.getElementById('loginSpinner');
            const errorDiv = document.getElementById('loginError');
            const email = document.getElementById('email').value.toLowerCase();
            const password = document.getElementById('password').value;

            console.log('Login form submitted:', { email, password });

            spinner.classList.remove('d-none');
            errorDiv.textContent = '';

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(user => user.email === email && user.password === password);

            setTimeout(() => {
                spinner.classList.add('d-none');
                if (user) {
                    errorDiv.textContent = 'Login successful! Redirecting...';
                    errorDiv.classList.remove('text-danger');
                    errorDiv.classList.add('text-success');
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    errorDiv.textContent = 'Invalid email or password. Please try again or register.';
                    errorDiv.classList.add('text-danger');
                }
            }, 1000);
        });
    }

    // Form Handling: Prediction
    const predictionForm = document.getElementById('predictionForm');
    if (predictionForm) {
        const symptomsInput = document.getElementById('symptoms');
        symptomsInput.removeAttribute('readonly');
        symptomsInput.removeAttribute('disabled');
        symptomsInput.setAttribute('contenteditable', 'true');

        console.log('Textarea initial state:', {
            readonly: symptomsInput.readOnly,
            disabled: symptomsInput.disabled,
            contenteditable: symptomsInput.contentEditable,
            value: symptomsInput.value
        });

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    console.warn(`Textarea attribute ${mutation.attributeName} changed to:`, symptomsInput.getAttribute(mutation.attributeName));
                }
            });
        });
        observer.observe(symptomsInput, { attributes: true });

        symptomsInput.addEventListener('input', () => {
            console.log('Textarea input detected:', symptomsInput.value);
        });

        symptomsInput.addEventListener('keydown', (e) => {
            if (e.defaultPrevented) {
                console.warn('Keydown event was prevented');
            }
        });

        predictionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const spinner = document.getElementById('predictSpinner');
            const resultDiv = document.getElementById('predictionResult');
            const symptoms = symptomsInput.value.trim();

            console.log('Prediction form submitted:', symptoms);

            spinner.classList.remove('d-none');
            resultDiv.textContent = '';

            try {
                if (!symptoms) {
                    resultDiv.classList.add('text-danger');
                    resultDiv.textContent = 'Please enter at least one symptom.';
                    spinner.classList.add('d-none');
                    return;
                }

                const symptomsArray = symptoms.split(/[\n,]+/).map(s => s.trim()).filter(s => s);
                const disease = 'Flu';
                resultDiv.classList.add('text-success');
                resultDiv.innerHTML = `
                    <div class="result-card">
                        <h4>Prediction Result</h4>
                        <p><strong>Possible Condition:</strong> ${disease}</p>
                        <p><strong>Recommendation:</strong> Consult a doctor for a proper diagnosis.</p>
                    </div>
                `;
                console.log('Mock prediction successful:', disease);
            } catch (error) {
                resultDiv.classList.add('text-danger');
                resultDiv.textContent = 'Error: Unable to get prediction. Please try again.';
                console.error('Prediction error:', error);
            } finally {
                spinner.classList.add('d-none');
            }
        });
    }

});

