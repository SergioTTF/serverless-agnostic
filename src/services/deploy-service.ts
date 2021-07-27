import Serverless = require("serverless");
import { Provider } from "../models/provider";
import { getSelectedProviders, isEmpty } from "../shared/utils";
import * as child_process from 'child_process';
import * as path from "path";
import { StdioOptions } from "child_process";

export class DeployService {

  selectedProviders: Provider[] = [];
  serverless: Serverless;
  folderPath: string;


  constructor(serverless: Serverless, declaredProviders: Provider[], options?: Serverless.Options) {
    
    this.serverless = serverless;
    this.folderPath = serverless.config.servicePath;
    if (options["provider"]) {
      this.selectedProviders = getSelectedProviders(options, declaredProviders);
    } else {
      this.selectedProviders = declaredProviders;
    }
  }

  public deploy() {
    this.serverless.cli.log(`Executing deploy for providers: ${this.selectedProviders.map(p => p.name).join(', ')}`);
    for(const provider of this.selectedProviders) {
      this.deployForProvider(provider);
    }
  }

  private deployForProvider(provider: Provider) {
    this.serverless.cli.log(`Deploying provider: ${provider.name}`);
    const providerFilePath = path.join(this.folderPath, '.serverless-agnostic', provider.name);
    if(provider.name === 'gcp') {
      child_process.execSync('npm install --save-dev serverless-google-cloudfunctions', {cwd: providerFilePath});
    }
    this.serverless.cli.log(`Installing dependencies`);
    child_process.execSync('npm install --production', {cwd: providerFilePath});
    const deployOptions = {
      cwd: providerFilePath,
      stdio: 'inherit' as StdioOptions
    }
    child_process.execSync('sls deploy', deployOptions)
  }
}