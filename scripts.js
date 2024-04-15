document.getElementById('storePassword').addEventListener('click', storePassword);
        document.getElementById('retrievePassword').addEventListener('click', retrievePassword);
        document.getElementById('exportButton').addEventListener('click', exportPasswords);
        document.getElementById('importButton').addEventListener('click', importPasswords);

        function storePassword() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username && password) {
                localStorage.setItem(username, JSON.stringify({ username, password }));
                updatePasswordList();
                clearInputFields();
            }
        }

        function retrievePassword() {
            const accountSelect = document.getElementById('accountSelect');
            const selectedUsername = accountSelect.options[accountSelect.selectedIndex]?.value;

            if (selectedUsername) {
                const accountData = JSON.parse(localStorage.getItem(selectedUsername));
                if (accountData) {
                    alert(`Username: ${accountData.username}\nPassword: ${accountData.password}`);
                } else {
                    alert('Account not found.');
                }
            }
        }

        function updatePasswordList() {
            const passwordList = document.getElementById('passwordList');
            const accountSelect = document.getElementById('accountSelect');

            passwordList.innerHTML = '';
            accountSelect.innerHTML = '<option value="">Select an Account</option>';

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const accountData = JSON.parse(localStorage.getItem(key));

                const listItem = document.createElement('li');
                listItem.textContent = `${accountData.username}: ${accountData.password}`;
                passwordList.appendChild(listItem);

                const option = document.createElement('option');
                option.value = accountData.username;
                option.textContent = accountData.username;
                accountSelect.appendChild(option);
            }
        }

        function clearInputFields() {
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        }

        function exportPasswords() {
            const passwordsExport = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const accountData = JSON.parse(localStorage.getItem(key));
                passwordsExport.push({
                    username: key,
                    password: accountData.password
                });
            }
            const jsonExport = JSON.stringify(passwordsExport, null, 2);
            const blob = new Blob([jsonExport], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'stored_passwords.json';
            a.click();
        }

        function importPasswords() {
            const fileInput = document.getElementById('importFile');
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        importedData.forEach(item => {
                            localStorage.setItem(item.username, JSON.stringify({
                                username: item.username,
                                password: item.password
                            }));
                        });
                        updatePasswordList();
                        alert("Passwords import success");
                    } catch (error) {
                        alert("Error importing passwords. Make sure the JSON file is valid.");
                    }
                };
                reader.readAsText(file);
            }
        }

        document.getElementById('password').addEventListener('input', updatePasswordStrength);

        function updatePasswordStrength() {
            const password = document.getElementById('password').value;
            const strengthIndicator = document.getElementById('passwordStrength');

            if (password.length < 8) {
                strengthIndicator.textContent = 'Weak';
                strengthIndicator.style.color = 'red';
            } else if (password.length < 12) {
                strengthIndicator.textContent = 'Medium';
                strengthIndicator.style.color = 'orange';
            } else {
                strengthIndicator.textContent = 'Strong';
                strengthIndicator.style.color = 'green';
            }
        }