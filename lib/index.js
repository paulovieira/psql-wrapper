var execSync = require('child_process').execSync;
var Chalk = require('chalk');
var _ = require('underscore');

var internals = {};

internals.config = {
	"host": "localhost",
	"port": "5432",
	"username": "",
	"password": "",
	"dbname": "",

	psqlPath: "",
	checkStderr: true,
	displayShellCommand: true
};

internals.createOptionsString = function(options){

	var command = '', option = '';
	for(var key in options){

		if(!options[key] || key === 'psqlPath' || key === 'checkStderr' || key === 'displayShellCommand'){
			continue;
		}

		option = `--${ key }`;
		if(typeof options[key] === 'string'){
			option += `="${ options[key] }"`;
		}

		command += ' ' + option;
	}

	// it's not possible to capture stderr with execSync, so instead we redirect it to stdout
	// and check stdout
	if(options.checkStderr){
		command += ' 2>&1';
	}

	return command;
};

internals.checkForErrors = function(output){

	if(output.toLowerCase().indexOf("error:") >=0){
		throw new Error(output);
	}
};

internals.Psql = function(options){

	options = _.extend({}, internals.config, options);
	var shellCommand =  `${ internals.config.psqlPath || 'psql' } ` +
						internals.createOptionsString(options);

/*
	var shellCommandToDisplay = shellCommand
								.trim()
								.replace(/\s\s+/g, ' ')
								.split(' ')
								.filter(s => s.indexOf('--password')!==0)
								.join(' ');
*/

	if(options.displayShellCommand){
		console.log(Chalk.blue.bold('executing:  ' + shellCommand));
	}

	var output = '';
	try{
		output = execSync(shellCommand, { encoding: 'utf8', maxBuffer: 1000*1024, stdio: 'inherit' });
		internals.checkForErrors(output);

		return output;
	}
	catch(err){
		console.log(Chalk.white.bgRed.bold(err.message.trim()));

		if(err.status > 0){
			console.log(Chalk.white.bgRed.bold('Exit code: ' + err.status + ' (for more details see: https://www.postgresql.org/docs/current/static/app-psql.html)'))
		}

		throw err;
	}

};

internals.Psql.configure = function(configOptions){

	for(var key in configOptions){
		internals.config[key] = configOptions[key];
	}
};

module.exports = internals.Psql;
