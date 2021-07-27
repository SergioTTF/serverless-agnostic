
module.exports = function(file, api, options) {

  const j = api.jscodeshift;
  const root = j(file.source);
  const handlerName = options.handlerName;
  const serverName = options.serverName;
  
  const requireStatement = j.variableDeclaration(
    "const",
    [j.variableDeclarator(
      j.identifier("sls"),
      j.callExpression(
        j.identifier("require"),
        [j.literal("serverless-http")]
      )
    )]
  );

  root.find(j.Program).get('body', 0).insertBefore(requireStatement);

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
      j.callExpression(
        j.identifier('sls'),
        [j.identifier(serverName)]
      )
    )
  );

  root.find(j.Program).get('body').push(exportStatement)
  
  return root.toSource();
}