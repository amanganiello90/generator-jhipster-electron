const chalk = require('chalk');
const semver = require('semver');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
// const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const fs = require('fs');
const path = require('path');
const packagejs = require('../../package.json');

let directory = '';
const dir = 'electron-jar-package';

module.exports = class extends BaseGenerator {
    get initializing() {
        return {
            init(args) {
                if (args === 'default') {
                    // do something when argument is 'default'
                }
            },
            readConfig() {
                this.jhipsterAppConfig = this.getAllJhipsterConfig();
                if (!this.jhipsterAppConfig) {
                    this.error(chalk.red.bold('Cannot read .yo-rc.json'));
                }
            },
            displayLogo() {
                // it's here to show that you can use functions from generator-jhipster
                // this function is in: generator-jhipster/generators/generator-base.js
                this.printJHipsterLogo();

                // Have Yeoman greet the user.
                this.log(
                    `\nWelcome to the ${chalk.bold.yellow('JHipster electron')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`
                );
            },
            checkJhipster() {
                const currentJhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
                const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
                if (!semver.satisfies(currentJhipsterVersion, minimumJhipsterVersion)) {
                    this.warning(
                        `\nYour generated project used an old JHipster version (${currentJhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`
                    );
                }
            }
        };
    }

    /* prompting() {
        const prompts = [
            {
                type: 'input',
                name: 'message',
                message: 'Please put something',
                default: 'hello world!'
            }
        ];

        const done = this.async();
        this.prompt(prompts).then((props) => {
            this.props = props;
            // To access props later use this.props.someOption;

            done();
        });
    }
    */

    writing() {
        // read config from .yo-rc.json
        this.clientPackageManager = this.jhipsterAppConfig.clientPackageManager;

        /*
        this.baseName = this.jhipsterAppConfig.baseName;
        this.packageName = this.jhipsterAppConfig.packageName;
        this.packageFolder = this.jhipsterAppConfig.packageFolder;
        this.clientFramework = this.jhipsterAppConfig.clientFramework;
        this.buildTool = this.jhipsterAppConfig.buildTool;
        */

        // use function in generator-base.js from generator-jhipster
        // this.angularAppName = this.getAngularAppName();

        // use constants from generator-constants.js
        /*  const javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
        const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
        const webappDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;
        */

        // variable from questions
        // this.message = this.props.message;

        // show all variables
        /*   this.log('\n--- some config read from config ---');
        this.log(`baseName=${this.baseName}`);
        this.log(`packageName=${this.packageName}`);
        this.log(`clientFramework=${this.clientFramework}`);
        this.log(`clientPackageManager=${this.clientPackageManager}`);
        this.log(`buildTool=${this.buildTool}`);

        this.log('\n--- some function ---');
        this.log(`angularAppName=${this.angularAppName}`);

        this.log('\n--- some const ---');
        this.log(`javaDir=${javaDir}`);
        this.log(`resourceDir=${resourceDir}`);
        this.log(`webappDir=${webappDir}`);

        this.log('\n--- variables from questions ---');
        this.log(`\nmessage=${this.message}`);
        this.log('------\n'); */

        this.log(`Generating folder '${dir}'`);
        if (!fs.existsSync(dir)) {
            directory = path.join(process.cwd(), dir);
            fs.mkdirSync(directory);
        } else {
            this.error(chalk.red.bold(`The folder: ${dir} already exists. Please delete before it!`));
        }
        process.chdir(directory);
        this.template('electron.app.config.json', `${directory}/electron.app.config.json`);
        this.template('index.html', `${directory}/index.html`);
        this.template('main.js', `${directory}/main.js`);
        this.template('package.json', `${directory}/package.json`);
        this.template('README.md', `${directory}/README.md`);
    }

    install() {
        const logMsg = `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install`)}`;

        const injectDependenciesAndConstants = err => {
            if (err) {
                this.warning('Install of dependencies failed!');
                this.log(logMsg);
            }
        };
        const installConfig = {
            bower: false,
            npm: this.clientPackageManager !== 'yarn',
            yarn: this.clientPackageManager === 'yarn',
            callback: injectDependenciesAndConstants
        };
        if (this.options['skip-install']) {
            this.log(logMsg);
        } else {
            this.installDependencies(installConfig);
        }
    }

    end() {
        this.log(
            `\nEnd of generation in ${chalk.yellow.bold(
                `${dir}`
            )} folder, now you can use this module after generating the target/*.jar. View the following instructions, to execute in that folder, into the generated ${chalk.yellow.bold(
                'README.md'
            )} :`
        );
        this.log(`1. To run the app in a live electron process, run: ${chalk.yellow.bold(`${this.clientPackageManager} start`)}`);
        this.log(`2. To package your app in an electron exe, run: ${chalk.yellow.bold(`${this.clientPackageManager} run package`)}`);
        this.log(`For both, when you open the electron window, you can view the backend log typing ${chalk.yellow.bold('F1 keyword')}`);
    }
};
