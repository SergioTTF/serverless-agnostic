module.exports = function(file, api, options) {

  const j = api.jscodeshift;
  const root = j(file.source);
  const handlerName = options.handlerName;
  const serverName = options.serverName;
  
  

  const exportStatement = j.expressionStatement(
    j.assignmentExpression(
      '=',
      j.memberExpression(
        j.memberExpression(
          j.identifier('module'),
          j.identifier('exports')
        ),
        j.identifier(handlerName)
      ),
      j.identifier(serverName)
    )
  );

  root.find(j.Program).get('body').push(exportStatement)
  
  return root.toSource();
}