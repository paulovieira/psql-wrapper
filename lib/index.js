let execSync = require('child_process').execSync;
let Chalk = require('chalk');
let Extend = require('just-extend');

let internals = {};

internals.psqlOptions = {
	"set": "ON_ERROR_STOP=on",
	// "username": "...",
	// "dbname": "...",
	// "file": "..."
};

internals.wrapperOptions = {
	psqlPath: "",
	displayShellCommand: true
}

module.exports = function (psqlOptions, wrapperOptions){

	psqlOptions = Extend({}, internals.psqlOptions, psqlOptions);
	wrapperOptions = Extend({}, internals.wrapperOptions, wrapperOptions);

	let optionsStr = internals.createPsqlOptionsStr(psqlOptions);
	let shellCommand =  `${ wrapperOptions.psqlPath || 'psql' } ${ optionsStr }`;

	// TODO: add timestamps
	if (wrapperOptions.displayShellCommand) {
		console.log(Chalk.blue.bold('executing:  ' + shellCommand));
	}

	let output = '';
	try {
		output = execSync(shellCommand, { encoding: 'utf8', maxBuffer: 1000 * 1024, stdio: 'pipe', timeout: 300 * 1000 });
		internals.checkForErrors(output);

		return output;
	}
	catch (err) {
		console.log(Chalk.white.bgRed.bold(err.message.trim()));

		let exitStatus = err.status;
		let exitStatusDesc = '';

		if (exitStatus >= 1 && exitStatus <= 3) {
			if (exitStatus === 1) {
				exitStatusDesc = ': fatal error';
			}
			else if (exitStatus === 2) {
				exitStatusDesc = ': bad connection to the server';
			}
			else if (exitStatus === 3) {
				exitStatusDesc = ': an error occurred in a script';
			}
			console.log(Chalk.white.bgRed.bold(`Exit code ${ exitStatus }${ exitStatusDesc }`) + ' (more details here: https://www.postgresql.org/docs/current/static/app-psql.html)')

			console.log(Chalk.white.bgRed.bold('\nstdout:') + internals.getOutputFormatted(err.output[1]))
			console.log(Chalk.white.bgRed.bold('\nstderr:') + internals.getOutputFormatted(err.output[2]))
		}
		else {
			console.log(Chalk.white.bgRed.bold('\nOutput from execSync:') + internals.getOutputFormatted(err.output))
		}

		throw err;
	}

};

module.exports.configure = function (psqlOption, wrapperOptions){

	internals.psqlOptions = Extend({}, internals.psqlOptions, psqlOptions);
	internals.wrapperOptions = Extend({}, internals.wrapperOptions, wrapperOptions);
};

// string with options
internals.createPsqlOptionsStr = function (psqlOptions, wrapperOptions){

	let optionsStr = '';
	for(let key in psqlOptions){

		// false options are ommited 
		if (psqlOptions[key] === false || psqlOptions[key] === 'false') {
			continue;
		}

		// make sure that wrapperOptions aren't used as psql options...
		if (key === 'psqlPath' || key === 'displayShellCommand') {
			continue;
		}

		// TODO: is there any case where the option value would be a number? should the number not have quotes?
		if (typeof psqlOptions[key] === 'string'){
			let value = psqlOptions[key];
			optionsStr = optionsStr + `--${ key }="${ psqlOptions[key] }" `;
		}
	}

	return optionsStr;
};

internals.checkForErrors = function (output){

	if(output.toLowerCase().indexOf("error:") >=0){
		throw new Error(output);
	}
};

internals.getOutputFormatted = function (output) {

	output = (output || '').trim();
	let finalOutput = '';

	if (output === '') {
		finalOutput = ' (no output)';
	}
	else {
		finalOutput = Chalk.white.bgRed.bold('\n----------------------------------------\n') + output + Chalk.white.bgRed.bold('\n----------------------------------------\n\n\n')
	}

	return finalOutput;
}