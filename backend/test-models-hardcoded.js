import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = "AIzaSyAFbOYrRkCXOobVwvfZmvawMj_eP9fYYl4";
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  try {
    console.log(`Testing model: ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Hello');
    console.log(`SUCCESS: ${modelName} worked!`);
    return true;
  } catch (error) {
    console.log(`FAILED: ${modelName} - ${error.message}`);
    return false;
  }
}

async function runTests() {
  await testModel('gemini-1.5-flash');
  await testModel('gemini-2.0-flash-exp');
  await testModel('gemini-1.5-pro');
}

runTests();
