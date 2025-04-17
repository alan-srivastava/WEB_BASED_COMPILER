document.getElementById('compile-btn').addEventListener('click', async () => {
    const outputElement = document.getElementById('output');
    const code = document.getElementById('code-editor').value;
    
    outputElement.innerHTML = '<span style="color: blue">Compiling...</span>';
    
    try {
        const response = await fetch('/compile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        
        const result = await response.json();
        
        if (result.error) {
            outputElement.innerHTML = `<span style="color: red">${result.error.replace(/\n/g, '<br>')}</span>`;
        } else {
            outputElement.innerHTML = `<span style="color: green">${result.output.replace(/\n/g, '<br>')}</span>`;
        }
    } catch (err) {
        outputElement.innerHTML = `
            <span style="color: red">
                <strong>Connection Error:</strong> ${err.message}<br><br>
                <strong>For E: drive setup, verify:</strong><br>
                1. MinGW is installed at E:\\mingw64<br>
                2. Node.js has permission to access E: drive<br>
                3. No antivirus is blocking the connection
            </span>`;
    }
});