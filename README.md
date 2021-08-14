# serverless-agnostic
A Serverless Framework Plugin to build provider agnostic serverless express.js applications. This plugin uses `jscodeshift` to perform transpilations(source-to-source compilations) in Javascript files, in order to adapt them to work with the different serverless providers. The library `serverless-http`is also used for enabling express routing in AWS Lambda specific handler format.

## 1. Installation

Run `npm install` in your Serverless project.

```bash
npm install --save-dev serverless-agnostic
```

Add the plugin to your serverless.yml file

```yml
plugins:
  - serverless-agnostic
```

## 2. Configuration
In order to use *serverless-agnostic* there should be one main `.serverless` configuration file for the plugin settings and one yaml file for each provider, in this provider yaml files there should be all Serverless Framework configuration required for that specific provider. The suggested name pattern for these files is `.serverless-{{PROVIDER_NAME}}.yml`.

### Sample folder structure for the project:
    .
    ├── ...
      ├── resources                   # sample files
      │   └── sample.png               
      ├── services                   
      │   └── hello-world.js
      ├── index.js
      ├── .serverless-gcp.yml         # GCP serverless config file
      ├── .serverless-aws.yml         # AWS serverless config file
      └── .serverless                 # main serverless config file
### Plugin Setup
The main `.serverless` file should have the plugin specific variables declared in the custom attributes section, under the `serverlessAgnostic` object.
<br>
Here's an example of a `.serverless` file:
```yml
custom:
  serverlessAgnostic:
    serverFile: index.js
    handlerName: myHandler
    serverName: app
    providers:
      - name: aws
        slsFilePath: serverless.aws.yml
      - name: gcp
        slsFilePath: serverless.gcp.yml
```
#### Atributes

| Attribute             | Description                                                                                                                  |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------|
| serverFile            | Consists of the name/path of the file that contains your express.js application.                                             |
| handlerName           | The name of the handler you're exporting in the module(It should match the handler name in your provider specific yaml file) |
| serverName            | Consists of the variable name used for the express.js application object(usually is `app`)                                   |
| providers.name        | Refers to the name of the provider(e.g. aws)                                                                                 |
| providers.slsFilePath | Refers to the name/path of the file that contains the specific configuration for the provider                                |

## 3. Commands

### Compile
The compile command its very straight foward, it compiles your code into the format accepted by the providers you specified in the `providers` attribute. The default behavior is to compile for all providers, but if you want to compile for one or more specific providers than you can user the `--provider` or `-p` flag. The generated files will be stored inside a file called `.serverless-agnostic`.

#### For all providers
```bash
serverless compile
```
#### For specific providers
```bash
serverless compile --provider aws
```

### Agnostic Deploy
The agnostic deploy command executes the Serverless Framework deploy for each provider declared, using the configuration described in the provider specific yaml files. The default behavior is to compile for all providers, but if you want to deploy for one or more specific providers than you can user the `--provider` or `-p` flag.

#### For all providers
```bash
serverless agnosticDeploy
```
#### For specific providers
```bash
serverless agnosticDeploy --provider gcp
```
## 4. Providers
Currently, the project only supports **Amazon Web Services** and **Google Cloud Platform**.
