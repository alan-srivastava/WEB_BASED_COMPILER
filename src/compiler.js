const path = require('path');
const { exec } = require('child_process');
const fs = require('fs-extra');

// Configure paths for E: drive
const tempDir = path.join(__dirname, 'temp');
const sourceFile = path.join(tempDir, 'source.cpp');
const executableFile = path.join(tempDir, 'program.exe');

// Explicit path to your g++ on E: drive
const gppPath = 'E:\\mingw64\\bin\\g++.exe';

module.exports = {
    async compileAndRun(code, compiler = gppPath) {
        try {
            // Ensure temp directory exists
            await fs.ensureDir(tempDir);
            
            // Write code to file with Windows line endings
            await fs.writeFile(sourceFile, code.replace(/\r\n/g, '\n'));
            
            // Compile with explicit path
            const compileResult = await this.compileCode(compiler);
            if (compileResult.error) {
                return { error: this.cleanError(compileResult.error) };
            }
            
            // Run the program
            const runResult = await this.runProgram();
            return { output: runResult.output };
        } catch (error) {
            return { error: this.cleanError(error.message) };
        }
    },
    
    compileCode(compiler) {
        return new Promise((resolve) => {
            // Escape paths for Windows command line
            const compileCommand = `"${compiler}" "${sourceFile}" -o "${executableFile}" -static -std=c++17`;
            
            exec(compileCommand, (error, stdout, stderr) => {
                if (error) {
                    resolve({ error: stderr });
                } else {
                    resolve({ output: stdout });
                }
            });
        });
    },
    
    runProgram() {
        return new Promise((resolve) => {
            exec(`"${executableFile}"`, { timeout: 5000 }, (error, stdout, stderr) => {
                if (error) {
                    resolve({ output: stderr || 'Program timed out or crashed' });
                } else {
                    resolve({ output: stdout });
                }
            });
        });
    },
    
    cleanError(errorMessage) {
        // Clean up path displays in error messages
        return errorMessage
            .replace(/E:\\/g, '')
            .replace(/\\/g, '/')
            .replace(new RegExp(tempDir.replace(/\\/g, '/'), 'g'), '');
    },
    
    async cleanup() {
        try {
            await fs.remove(sourceFile);
            await fs.remove(executableFile);
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }
};