import { Provider } from './../models/provider';
import Serverless = require("serverless");
import Service = require("serverless/classes/Service");
import { supportedProviders } from '../shared/constants';

export class ProviderService {

  public providers: Provider[] = [];


  constructor(serverless: Serverless, options?: Serverless.Options) {
    this.providers = this.getProvidersFromConfig(serverless.service)
    if(this.providers.length == 0) {
      throw new Error("There are no Providers declared in serverless.yml file, they should be declared on the custom field")
    }
  }

  private getProvidersFromConfig(service: Service): Provider[] {
    let providersInConfig: Provider[] = service.custom['serverlessAgnostic'].providers;
    providersInConfig.forEach(p => {
      if(!supportedProviders.includes(p.name)) {
        throw new Error(`Provider ${p.name} is not yet supported or misspelled. Here's a list of the supported ones: ${supportedProviders.join(',')}`);
      }
    })
    return providersInConfig;
  }

  

}