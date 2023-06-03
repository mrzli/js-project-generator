const { lastValueFrom, tap } = require('rxjs');
const { glob } = require('glob');
const { fromExec } = require('@gmjs/exec-observable');
const { readTextAsync } = require('@gmjs/fs-async');

async function run() {
  console.log('Publishing...');
  const projectJsonContent = await readTextAsync('project.json');
  const projectJson = JSON.parse(projectJsonContent);
  // validate projectJson
  const { publishDir, include } = projectJson.publish;
  const files = await glob(include);
  await exec('cp', ['-R', ...files, publishDir]);
  await exec('npm', ['publish', '--access', 'public'], { cwd: publishDir });
}

async function exec(cmd, args, options) {
  await lastValueFrom(
    fromExec(cmd, args, options).pipe(
      tap((event) => {
        if (event.kind === 'data-stdout') {
          console.log(event.data);
        } else if (event.kind === 'data-stderr') {
          console.error(event.data);
        }
      })
    )
  );
}

run();
