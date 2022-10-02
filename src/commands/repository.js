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

    console.log(parameters)

    let Repository = capitalize(repository)

    defaultImplementation = defaultImplementation
      ? capitalize(defaultImplementation)
      : 'Prisma'

    let Module = repository

    if (!Repository.includes('Repository')) {
      Repository += 'Repository'
      repository += 'Repository'
    } else {
      Module = Module.replace('Repository', '')
    }

    const module = Module.toLowerCase()

    const Implementation = defaultImplementation + Repository

    const version = parameters.string.includes('v2') || parameters.raw.includes("--v2")

    const pathModule = version ? 'core' : 'modules'

    const props = {
      module,
      repository,
      Repository,
      Module,
      Implementation,
    }

    generate({
      template: 'repository/contract.ejs',
      target: `./src/${pathModule}/repositories/${Repository}.ts`,
      props,
    })

    generate({
      template: 'repository/implementation.ejs',
      target: `./src/${pathModule}/repositories/implementation/${Implementation}.ts`,
      props,
    })

    info(`Generated repo ${repository} ${Implementation}`)
  },
}
