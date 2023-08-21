const { exec } = require('child_process');
const { generateFile, generateInput } = require('./fileGenerator');
const { v4: uuid } = require('uuid');
const path = require('path');
const fs = require('fs');
const { getTestcases } = require('./getTestCases');

const outputPath = path.join(__dirname, "codes");

const emptyDirAsync = async (dir) => {
  const files = await fs.promises.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    if ((await fs.promises.stat(filePath)).isDirectory()) {
      await emptyDirAsync(filePath); // Recursively empty subdirectories
      await fs.promises.rmdir(filePath);
    } else {
      await fs.promises.unlink(filePath);
    }
  }
  // After deleting all files and subdirectories, attempt to remove the main directory
  try {
    await fs.promises.rmdir(dir);
  } catch (error) {
    // The directory might not be empty, which is expected
    console.error('Error removing directory:', error.message);
  }
};

const executeCpp = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outpath = path.join(outputPath, `${jobId}.out`);
  console.log('jobId:'+ jobId);
  console.log('outpath:'+ outpath);
  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filepath} -o ${outpath} && cd ${outputPath} && .\\${jobId}.out < input.txt`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
};

const executePy = (filepath) => {
  return new Promise((resolve, reject) => {
    exec(
      `cd ${outputPath} && python ${filepath} < input.txt`, 
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        } else if (stderr) {
          reject(stderr);
        } else {
          resolve(stdout); 
        }
      }
    );
  });
};



const compileAndExecuteCode = async (code, language, title ) => {
  const fileExtension = language === 'cpp' ? 'cpp' : 'py';
  try{
    const filepath = await generateFile(fileExtension, code);
    console.log('filepath:' + filepath);
    let compilationCommand;
    //let outputPath;
    const fileId = path.basename(filepath, path.extname(filepath));
    const Tcases = await getTestcases(title);
    const testcases = Tcases;
    if (testcases.length === 0) {
      return { error: "No test cases found for the provided title." };
    }

    let accepted = 0;
    const totalcases = testcases.length;
    let output;
    const errorArray = [];
    for(let i=0;i<totalcases;i++){
      try {
        const testcase = testcases[i];
        const inputfile = await generateInput(testcase.hiddenTestCasesInput);
        if(fileExtension==='cpp'){
          output = await executeCpp(filepath);
        }
        else  if(fileExtension==='py'){
          output = await executePy(filepath);
        }
        console.log(output);
        const out = output.trim();
        console.log('output:'+out);
        if (out == testcase.hiddenTestCasesOutput) {
          console.log('accepted');
          accepted = accepted + 1;
        }
      } catch (err) {
        console.log('Error executing code1:', err);
        errorArray.push(err); 
      }
    }

    if (errorArray.length > 0) {
      // If there are errors, send a response
      console.log('more errors');
      return { isCorr:"errors", error: errorArray };
    }

    let isCorr;

    if (accepted == totalcases) isCorr = "accepted";
    else isCorr = "WA";

    return {isCorrect: isCorr, error: null};

  //   emptyDirAsync(outputPath)
  // .then(() => {
  //   console.log('Directory emptied successfully.');
  //   return { isCorrect: isCorr, error: null };
  // })
  // .catch((error) => {
  //   console.error('Error emptying directory:', error);
  // });

  }
  catch(error){
    console.log('Error executing code:', error);
    return { isCorrect:"WA", error: 'Internal server error' };
  }
};

module.exports = {
  compileAndExecuteCode,
};
