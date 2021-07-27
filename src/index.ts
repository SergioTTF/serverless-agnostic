import { ProviderService } from './services/provider-service';
'use strict';

import * as Serverless from "serverless";
import { executeTransformation } from "./transforms/transformation";
import { CompileService } from './services/compile-service';
import { DeployService } from './services/deploy-service';


export default class ServerlessPlugin {
  serverless: Serverless;
  options: Serverless.Options;
  hooks: { [key: string]: Function };
  commands: Object;
  public constructor( serverless: Serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.commands = {
      compile: {
        usage: 'Compile your code into provider specific format, the default behavior is to compile for all providers.',
        lifecycleEvents: ['assemble', 'compile'],
        options: {
          provider: {
            usage:
              'Compile for specific provider(s)' +
              '(e.g. "--provider aws --provider gcp" or "-p aws -p gcp")',
            required: false,
            shortcut: 'p',
            type: 'multiple'
          },
        },
      },
      agnosticDeploy: {
        usage: 'Deploy function for providers',
        lifecycleEvents: ['deploy'],
        options: {
          provider: {
            usage:
              'Deploy for specific provider(s)' +
              '(e.g. "--provider aws --provider gcp" or "-p aws -p gcp")',
            required: false,
            shortcut: 'p',
            type: 'multiple'
          },
        },
      },
    };

    this.hooks = {
      'compile:assemble': this.initializeCompilation.bind(this),
      'agnosticDeploy:deploy': this.deployApplications.bind(this)
    };
  }

  initializeCompilation() {
    const providerService = new ProviderService(this.serverless, this.options);
    const compileService = new CompileService(this.serverless, providerService.providers, this.options);
    
    compileService.compileProject();
  }

  deployApplications() {
    const providerService = new ProviderService(this.serverless, this.options);
    const deployService = new DeployService(this.serverless, providerService.providers, this.options);

    deployService.deploy();
  }

}

module.exports = ServerlessPlugin;
