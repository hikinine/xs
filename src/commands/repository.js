const { capitalize } = require('../utils/capitalize')

module.exports = {
  name: 'new:repository',
  alias: ['repository'],
  run: async (toolbox) => {
    const { parameters, template, print, filesystem } = toolbox

    const { generate } = template
    const { info } = print

    let repository = parameters.first
    let defaultImplementation = parameters.second

    if (!repository) {
      return info('one arguments expected')
    }

    let Repository = capitalize(repository)
    
    defaultImplementation = defaultImplementation 
      ? capitalize(defaultImplementation)
      : "Prisma"
    

    let Module = repository;
    
    if (!Repository.includes("Repository")) {
      Repository += "Repository"
      repository += "Repository"
    }
    else { Module = Module.replace("Repository", "")}

    const module = Module.toLowerCase()

    const Implementation =  defaultImplementation + Repository

    const props = {
      module,
      repository,
      Repository,
      Module,
      Implementation
    }

    generate({
      template: 'repository/contract.ejs',
      target: `./src/modules/repositories/${Repository}.ts`,
      props,
    })

    generate({
      template: 'repository/implementation.ejs',
      target: `./src/modules/repositories/implementation/${Implementation}.ts`,
      props,
    })

    info(`Generated repo ${repository} ${Implementation}`)

  },
}
