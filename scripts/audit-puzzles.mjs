import fs from 'node:fs';
const source = fs.readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8');
const expectedFirst30 = ['●●●●','▲','32','25','15','27','8','48','1','□','49','95','30','U','62','21','10','13','125','↗','46','2.75','24','22','720','7','13','16','14','40'];
const entries = [...source.matchAll(/\{title:'([^']+)',instruction:'([^']*)',sequence:\[(.*?)\],answers:\[(.*?)\],correct:(\d+),hint:'([^']*)',explain:'([^']*)',difficulty:(\d)\}/g)];
const errors = [];
if (entries.length !== 60) errors.push(`Expected 60 puzzles, found ${entries.length}.`);
entries.forEach((m, i) => {
 const title=m[1], answers=[...m[4].matchAll(/'([^']*)'/g)].map(x=>x[1]), correct=Number(m[5]);
 if (answers.length !== 4) errors.push(`${i+1}. ${title}: expected 4 answers, found ${answers.length}.`);
 if (new Set(answers).size !== answers.length) errors.push(`${i+1}. ${title}: duplicate answer choices.`);
 if (!Number.isInteger(correct)||correct<0||correct>=answers.length) errors.push(`${i+1}. ${title}: correct index out of range.`);
 if (!m[6]||!m[7]) errors.push(`${i+1}. ${title}: missing hint or explanation.`);
 if (i<30 && answers[correct]!==expectedFirst30[i]) errors.push(`${i+1}. ${title}: expected '${expectedFirst30[i]}', got '${answers[correct]}'.`);
});
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`Puzzle audit passed: ${entries.length} puzzles; answer options and first 30 answer keys validated.`);
