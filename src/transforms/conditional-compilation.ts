
module.exports = function(file, api, options) {

  const j = api.jscodeshift;
  const root = j(file.source);
  const provider = options.provider;
  
  root.find(j.IfStatement, {test: {object: { type: "Identifier", name: "PROVIDER" }}}).replaceWith(ifStatement => {
  	
    const blockProvider = ifStatement.getValueProperty('test').property.name;
    if(blockProvider === provider) {
      ifStatement.getValueProperty('consequent').body.forEach(n => {
        ifStatement.insertBefore(n);
      })
    }
  
  })
  
  return root.toSource();
}