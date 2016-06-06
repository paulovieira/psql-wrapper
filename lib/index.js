var execSync = require('child_process').execSync;
var Chalk = require('chalk');

var internals = {};

internals.config = {
	"host": "localhost",
	"port": "5432",
	"username": "",
	"password": "",
	"dbname": "",

	"psqlPath": "",
	"displayShellCommand": true
};

internals.createOptionsString = function(obj){

	var command = '', option = '';
	for(var key in obj){

		if(!obj[key] || key === 'displayShellCommand'){
			continue;
		}

		option = `--${ key }`;
		if(typeof obj[key] === 'string'){
			option += `="${ obj[key] }"`;
		}

		command += ' ' + option;
	}

	return command;
};

internals.Psql = function(options){

	var shellCommand =  `${ internals.config.psqlPath || 'psql' } ` +
						internals.createOptionsString(internals.config) +
						internals.createOptionsString(options || {});

	var shellCommandToDisplay = shellCommand
								.trim()
								.replace(/\s\s+/g, ' ')
								.split(' ')
								.filter(s => s.indexOf('--password')!==0)
								.join(' ');

	// TODO: if the pass false in the options to the main exported function, the respective option given in config should be ignored
	// this pattern should be applied to other options as well; we should make a merge 
	if(options.displayShellCommand){
		console.log(Chalk.blue.bold('executing:  ' + shellCommandToDisplay));
	}
	else if(internals.config.displayShellCommand){
		console.log(Chalk.blue.bold('executing:  ' + shellCommandToDisplay));
	}

	var stdout = '';
	try{
		stdout = execSync(shellCommand, { encoding: 'utf8' });
		return stdout;
	}
	catch(err){
		console.log(Chalk.white.bgRed.bold(err.message.trim()));
		process.exit(1);
	}

};

internals.Psql.configure = function(configOptions){

	for(var key in configOptions){
		internals.config[key] = configOptions[key];
	}
};

module.exports = internals.Psql;
