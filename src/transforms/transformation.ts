import * as execa from 'execa'
import * as path from 'path'

export const transformerDirectory = path.join(__dirname, '../', 'transformers')
export const jscodeshiftExecutable = require.resolve('.bin/jscodeshift')

export function executeTransformation(provider: string, filePath: string, handlerName: string, serverName: string) {

  const transformationPath = path.join(__dirname, 'providers', `${provider}.js`)

  const args = ['-t', transformationPath, filePath, `--handlerName=${handlerName}`, `--serverName=${serverName}`];

  const result = execa.sync(jscodeshiftExecutable, args, {
    stdio: 'inherit',
    stripFinalNewline: false,
  })

  if (result.stderr) {
    throw result.stderr
  }
}

export function executeConditionalCompilation(provider:string, folderPath: string) {

  const transformationPath = path.join(__dirname, 'conditional-compilation.js');
  const args = ['-t', transformationPath, folderPath, `--provider=${provider}`];

  const result = execa.sync(jscodeshiftExecutable, args, {
    stdio: 'inherit',
    stripFinalNewline: false,
  })

  if (result.stderr) {
    throw result.stderr
  }

}