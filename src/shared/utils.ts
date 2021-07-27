import { Provider } from "../models/provider";
import { supportedProviders } from "./constants";

export function isEmpty(object: any) {  
    return !Object.values(object).some(v => v !== null && typeof v !== "undefined")
}

export function getSelectedProviders(options: any, declaredProviders: Provider[]): Provider[] {
  const providers: Provider[] = []
  const selectedProviders = getArrayOfString(options['provider']);
  selectedProviders.forEach( p => {
    const providerDeclared = declaredProviders.find(dp => dp.name === p)
    if(providerDeclared) {
      providers.push(providerDeclared);
    } else {
      throw new Error(`Provider with name ${p} is not yet supported or misspelled. Here's a list of the supported ones: ${supportedProviders.join(', ')}`)
    }
  })
  return providers;
}

function getArrayOfString(input:string | string[]): string[] {
  if(typeof input === 'string') {
    return [input];
  } else {
    return input;
  }
}