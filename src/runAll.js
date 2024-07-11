import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const runCommand = async (command) => {
  try {
    const { stdout, stderr } = await execPromise(command);
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
  } catch (error) {
    console.error('Error executing command:', error);
  }
};

const runAll = async () => {
  try {
    console.log('Running signUp script...');
    await runCommand('node src/signUp.js');

    console.log('Running signIn script...');
    await runCommand('node src/signIn.js');
  } catch (error) {
    console.error('Error running scripts:', error);
  }
};

runAll();
