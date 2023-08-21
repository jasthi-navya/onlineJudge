const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (format, content) => {
  const jobID = uuid();
  const filename = `${jobID}.${format}`;
  const filePath = path.join(dirCodes, filename);
  await fs.promises.writeFile(filePath, content);
  return filePath;
};

const generateInput = async (content) => {
  const filename = `input.txt`;
  const filepath = path.join(dirCodes,filename);
  try {
    await fs.promises.writeFile(filepath, content);
    return filepath;
  } catch (error) {
    console.error('Error writing input file:', error);
    throw error;
  }
  console.log('ip file gen');
  return filepath;
}

module.exports = {
  generateFile,generateInput
};
