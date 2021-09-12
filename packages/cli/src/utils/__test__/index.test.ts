// import faker from 'faker';
// import cloneDeep from 'lodash.clonedeep';
// import { PARAGRAPH } from 'editure-constants';
// import {
//   Step,
//   StepTitle,
//   File,
//   DiffBlock,
//   Explain,
//   randHex,
//   isCommitEqual,
// } from '@tuture/core';

// import { mergeSteps } from '../index';
// import { newEmptyExplain, newEmptyContent } from '../nodes';

// function getFakeExplain(): Explain {
//   const numOfParagraphs = faker.random.number({ min: 1, max: 5 });

//   return {
//     type: 'explain',
//     fixed: true,
//     children: ' '
//       .repeat(numOfParagraphs)
//       .split('')
//       .map(() => ({
//         type: PARAGRAPH,
//         children: [{ text: faker.lorem.paragraph() }],
//       })),
//   };
// }

// function getFakeStepTitle(commit: string): StepTitle {
//   return {
//     type: 'heading-two',
//     fixed: true,
//     id: randHex(8),
//     commit,
//     children: [{ text: faker.lorem.sentence() }],
//   };
// }

// function getFakeDiffBlock(commit: string, file: string): DiffBlock {
//   return {
//     type: 'diff-block',
//     file,
//     commit,
//     children: getEmptyChildren(),
//   };
// }

// function getFakeFile(commit: string): File {
//   const file = faker.lorem.word();

//   return {
//     type: 'file',
//     display: true,
//     file,
//     children: [
//       newEmptyExplain(),
//       getFakeDiffBlock(commit, file),
//       newEmptyExplain(),
//     ],
//   };
// }

// function getFakeFiles(commit: string, num?: number) {
//   const numOfFiles = num || faker.random.number({ min: 1, max: 5 });
//   return ' '
//     .repeat(numOfFiles)
//     .split('')
//     .map(() => getFakeFile(commit));
// }

// function getFakeStep(): Step {
//   const commit = randHex(32);
//   return {
//     type: 'step',
//     id: randHex(8),
//     articleId: randHex(8),
//     commit,
//     children: [
//       getFakeStepTitle(commit),
//       newEmptyExplain(),
//       ...getFakeFiles(commit),
//       newEmptyExplain(),
//     ],
//   };
// }

// function getFakeSteps(num: number) {
//   return ' '
//     .repeat(num)
//     .split('')
//     .map(() => getFakeStep());
// }

// function populateSteps(steps: Step[]) {
//   return steps.map((step) => {
//     const clonedStep = cloneDeep<Step>(step);

//     for (let i = 0; i < clonedStep.children.length; i++) {
//       const child = clonedStep.children[i];

//       if (child.type === 'explain') {
//         clonedStep.children[i] = getFakeExplain();
//       } else if (child.type === 'file') {
//         child.children[0] = getFakeExplain();
//         child.children[2] = getFakeExplain();
//       }
//     }

//     return clonedStep;
//   });
// }

// describe('utils/index', () => {
//   describe('isCommitEqual', () => {
//     const hashA = randHex();
//     const hashB = randHex();

//     test('commits with exactly the same hash', () => {
//       expect(isCommitEqual(hashA, hashA)).toBe(true);
//     });

//     test('commits with different hashes', () => {
//       expect(isCommitEqual(hashA, hashB)).toBe(false);
//     });

//     test('same commit with different digits', () => {
//       expect(isCommitEqual(hashA, hashA.slice(0, 8))).toBe(true);
//       expect(isCommitEqual(hashB.slice(0, 8), hashB)).toBe(true);
//     });
//   });

//   describe('mergeSteps', () => {
//     test('add a new step', () => {
//       const [step1, step2, step3] = getFakeSteps(3);
//       const [pStep1, pStep2] = populateSteps([step1, step2]);

//       const prevSteps = [pStep1, pStep2];
//       const newSteps = [step1, step2, step3];
//       const mergedSteps = mergeSteps(prevSteps, newSteps);

//       expect(mergedSteps).toStrictEqual([pStep1, pStep2, step3]);
//     });

//     test('add multiple new steps', () => {
//       const [step1, step2, step3] = getFakeSteps(3);
//       const [pStep1] = populateSteps([step1]);

//       const prevSteps = [pStep1];
//       const newSteps = [step1, step2, step3];
//       const mergedSteps = mergeSteps(prevSteps, newSteps);

//       expect(mergedSteps).toStrictEqual([pStep1, step2, step3]);
//     });

//     test('last commit outdated', () => {
//       const [step1, step2, step3] = getFakeSteps(3);
//       const [pStep1, pStep2] = populateSteps([step1, step2]);

//       const prevSteps = [pStep1, pStep2];
//       const newSteps = [step1, step3];
//       const mergedSteps = mergeSteps(prevSteps, newSteps);

//       expect(mergedSteps).toStrictEqual([
//         pStep1,
//         step3,
//         { ...pStep2, outdated: true },
//       ]);
//     });

//     test('all commits outdated', () => {
//       const [step1, step2, step3, step4] = getFakeSteps(4);
//       const [pStep1, pStep2] = populateSteps([step1, step2]);

//       const prevSteps = [pStep1, pStep2];
//       const newSteps = [step3, step4];
//       const mergedSteps = mergeSteps(prevSteps, newSteps);

//       expect(mergedSteps).toStrictEqual([
//         step3,
//         step4,
//         { ...pStep1, outdated: true },
//         { ...pStep2, outdated: true },
//       ]);
//     });
//   });

//   describe('isInitialized', () => {});
// });
