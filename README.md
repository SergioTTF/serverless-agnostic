# serverless-agnostic
A Serverless Framework Plugin to build provider agnostic serverless express.js applications.

## Installation

Run `npm install` in your Serverless project.

`$ npm install --save-dev serverless-agnostic`

Add the plugin to your serverless.yml file

```yml
plugins:
  - serverless-agnostic
```

## Configuration
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
