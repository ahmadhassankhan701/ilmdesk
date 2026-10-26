import assert from "node:assert/strict";
import { questionsFromWorkbook, sampleWorkbook } from "./quizWorkbook.js";

const questions = questionsFromWorkbook(sampleWorkbook());
assert.equal(questions.length, 2);
assert.equal(questions[0].correctOption, 1);
assert.equal(questions[1].correctOption, 2);
assert.equal(questions[1].options[2], "Carbon dioxide");

console.log("quiz workbook ok");
