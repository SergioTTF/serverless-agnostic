import * as fs from "fs-extra";
import * as path from "path";
import * as os from "os";
import Serverless = require("serverless");
import { Provider } from "../models/provider";
import { getSelectedProviders, isEmpty } from "../shared/utils";
import { executeConditionalCompilation, executeTransformation } from "../transforms/transformation";

export class CompileService {

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

  private cleanProviderCompiledFiles(provider: Provider): void {
    
    const serverlessDir = path.join(this.folderPath, ".serverless-agnostic", provider.name);
    this.serverless.cli.log(`Removing .serverless-agnostic directory for provider: ${provider.name}`)
    fs.removeSync(serverlessDir);
    
  }

  

  public compileProject(): void {

    this.serverless.cli.log(`Compiling Serverless Project for providers: ${this.selectedProviders.map(p => p.name).join(', ')}`);
    
    this.selectedProviders.forEach(provider => {
      this.serverless.cli.log(`Compiling Provider: ${provider.name}`)

      this.cleanProviderCompiledFiles(provider);
      const tempDirPath = this.cloneProjectForProvider(provider);
      this.transformFilesForProvider(provider, tempDirPath);
      const providerPath = path.join(this.folderPath, ".serverless-agnostic", provider.name);
      fs.copySync(tempDirPath, providerPath);

      const packagePath = path.join(providerPath, 'package.json');
      const packageJson = require(packagePath);
      if(provider.name === 'aws') {
        packageJson.dependencies["serverless-http"] = "^2.7.0";
      }
      delete packageJson.dependencies["serverless-agnostic"];
      delete packageJson.devDependencies["serverless-agnostic"];
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 4));
    })
    
    
  }

  private cloneProjectForProvider(provider: Provider): string {
    const tempDirPath = fs.mkdtempSync(path.join(os.tmpdir(),`${provider.name}-`));
    fs.copySync(this.folderPath, tempDirPath, {filter: this.filterFiles});
    const slsConfigPath = path.join(this.folderPath, provider.slsFilePath);
    fs.copySync(slsConfigPath, path.join(tempDirPath, 'serverless.yml'));

    return tempDirPath;
  }

  private filterFiles = (src:string, dest: string) => {
    
    if(src.startsWith(path.join(this.folderPath, 'node_modules')) ||
    src.startsWith(path.join(this.folderPath, '.serverless')) || 
    (src.startsWith(path.join(this.folderPath, 'serverless')) && src.endsWith('.yml'))) {
      return false;
    } else {
      return true;
    }
  }

  private transformFilesForProvider(provider: Provider, tempDirPath: string) {
    const serverFile = this.serverless.service.custom['serverlessAgnostic'].serverFile || 'index.js';
    const handlerName = this.serverless.service.custom['serverlessAgnostic'].handlerName || 'handler';
    const serverName = this.serverless.service.custom['serverlessAgnostic'].serverName || 'app';
    const serverFilePath = path.join(tempDirPath, serverFile);
    executeTransformation(provider.name, serverFilePath, handlerName, serverName);
    executeConditionalCompilation(provider.name, tempDirPath);
  }
}