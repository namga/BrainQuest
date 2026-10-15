import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8');
const expectedAnswers = [
  '●●●●','▲','32','25','15','27','8','48','1','□',
  '49','95','30','U','62','21','10','13','125','↗',
  '46','2.75','24','22','720','7','13','16','14','40'
];
const entries = [...source.matchAll(/\{title:'([^']+)',instruction:'([^']*)',sequence:\[(.*?)\],answers:\[(.*?)\],correct:(\d+),hint:'([^']*)',explain:'([^']*)',difficulty:(\d)\}/g)];
const errors = [];
if (entries.length !== expectedAnswers.length) errors.push(`Expected ${expectedAnswers.length} puzzles, found ${entries.length}.`);
entries.forEach((match, i) => {
  const title = match[1];
  const answers = [...match[4].matchAll(/'([^']*)'/g)].map(x => x[1]);
  const correct = Number(match[5]);
  if (answers.length !== 4) errors.push(`${i + 1}. ${title}: expected 4 answers, found ${answers.length}.`);
  if (new Set(answers).size !== answers.length) errors.push(`${i + 1}. ${title}: duplicate answer choices.`);
  if (!Number.isInteger(correct) || correct < 0 || correct >= answers.length) errors.push(`${i + 1}. ${title}: correct index is out of range.`);
  if (!match[6] || !match[7]) errors.push(`${i + 1}. ${title}: hint or explanation is missing.`);
  if (answers[correct] !== expectedAnswers[i]) errors.push(`${i + 1}. ${title}: answer key expected '${expectedAnswers[i]}', got '${answers[correct]}'.`);
  const difficulty = Number(match[8]);
  if (![1, 2, 3].includes(difficulty)) errors.push(`${i + 1}. ${title}: difficulty must be 1, 2, or 3.`);
});
if (errors.length) {
  console.error('Puzzle audit failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log(`Puzzle audit passed: ${entries.length} puzzles, unique answer options, valid indices, reviewed answer keys and difficulty tiers.`);
