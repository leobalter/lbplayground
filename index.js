import fs from 'fs';
import { createInterface } from 'readline';
import packageFile from './package.json' with { type: "json" };
const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

const year = new Date().getFullYear();
const name = packageFile.author;

const filename = process.argv[2];

const licenseText = `
# MIT License

Copyright (c) ${year} ${name}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

function promptQuestion(question) {
    return new Promise((resolve) => {
        readline.question(question, (answer) => {
            resolve(answer.toLowerCase());
        });
    });
}

if (filename) {
    if (fs.existsSync(filename)) {
        const answer = await promptQuestion(`File ${filename} already exists. Do you want to overwrite it? (y/n)`);
        if (answer === 'y' || answer == '') {
            fs.writeFileSync(filename, licenseText);
            console.log(`File ${filename} was successfully updated.`);
            process.exit(0);
        } else {
            const printAnswer = await promptQuestion('Do you want to print the license to stdout? (y/n)');
            if (printAnswer.toLowerCase() === 'y' || printAnswer == '') {
                console.log(licenseText);
            }
            process.exit(0);
        }
    } else {
        fs.writeFileSync(filename, licenseText);
        console.log(`File ${filename} was successfully created.`);
        process.exit(0);
    }
} else {
    console.log(licenseText);
}
