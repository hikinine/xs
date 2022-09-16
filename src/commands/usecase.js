const { capitalize } = require('../utils/capitalize')
const fs = require('fs')

module.exports = {
  name: 'new:usecase',
  alias: ['project'],
  run: async (toolbox) => {
    const { parameters, template, print, filesystem } = toolbox

    const { generate } = template
    const { info, warning, success } = print

    const useCase = parameters.first
    let collectionModules = parameters.second?.toLowerCase()
    const routesParams = parameters.third

    if (!useCase || !collectionModules || !routesParams) {
      warning(
        'BillingDownloadPDF repo1,repo2,repo3 METHOD,/ROUTE-PATH,/ROUTE-FILENAME'
      )
      success(
        'BillingDownloadPDF billing,bucket,queue GET#/my-downloads#billing'
      )
      return
    }

    const UseCase = capitalize(useCase)
    const Modules = collectionModules
      .split(',')
      .map((module) => capitalize(module))
    collectionModules = collectionModules.split(',')

    const Repositories = Modules.map((thisModule) => thisModule + 'Repository')
    const repositories = Modules.map((thisModule) => thisModule + 'Repository')
    const Implementation = Repositories.map((thisRepo) => 'Prisma' + thisRepo)
    const implementation = Repositories.map((thisRepo) => 'Prisma' + thisRepo)

    const Controller = UseCase + 'Controller'
    const controller =
      useCase.charAt(0).toLowerCase() + (useCase + 'Controller').slice(1)
    const Service = UseCase + 'Service'
    const service =
      useCase.charAt(0).toLowerCase() + (useCase + 'Service').slice(1)
    const DTO = UseCase + 'DTO'
    const Validation = UseCase + 'Validation'

    const method = routesParams.split('#')[0]?.toLowerCase()
    const route = routesParams.split('#')[1]
    const routeFileName = routesParams.split('#')[2]

    if (!method || !route | !routeFileName) {
      warning(
        'BillingDownloadPDF repo1,repo2,repo3 METHOD,/ROUTE-PATH,/ROUTE-FILENAME'
      )
      success(
        'BillingDownloadPDF billing,bucket,queue GET#/my-downloads#billing'
      )
      warning('Missing route pattern. Sample GET#/my-downloads#billing ')
      return
    }
    await filesystem.dir(`./src/modules/usecase/${useCase}`)

    const props = {
      Modules,
      service,
      collectionModules,
      useCase,
      UseCase,
      Controller,
      controller,
      Repositories,
      repositories,
      Service,
      DTO,
      Validation,
      Implementation,
      implementation,

      method,
      route,
      routeFileName,
    }

    generate({
      template: 'usecase/controller.ejs',
      target: `./src/modules/usecase/${useCase}/${Controller}.ts`,
      props,
    })
    generate({
      template: 'usecase/index.ejs',
      target: `./src/modules/usecase/${useCase}/index.ts`,
      props,
    })

    generate({
      template: 'usecase/service.ejs',
      target: `./src/modules/usecase/${useCase}/${Service}.ts`,
      props,
    })
    generate({
      template: 'usecase/validation.ejs',
      target: `./src/modules/usecase/${useCase}/${Validation}.ts`,
      props,
    })
    generate({
      template: 'usecase/dto.ejs',
      target: `./src/modules/usecase/${useCase}/${DTO}.ts`,
      props,
    })

    try {
      const file = fs.readFileSync(
        './src/shared/infra/http/routes/' + routeFileName + '.routes.ts'
      )

      const routesSafeCopy = file
        .toString('utf8')
        .replace(/"/gi, '@')
        .replace(/'/gi, '@')

      await generate({
        template: 'usecase/route-injection.ejs',
        target:
          './src/shared/infra/http/routes/' + routeFileName + '.routes.ts',
        props: {
          ...props,
          routesSafeCopy: routesSafeCopy,
        },
      })

      const finalFile = fs.readFileSync(
        './src/shared/infra/http/routes/' + routeFileName + '.routes.ts'
      )

      const final = finalFile.toString('utf8').replace(/@/gi, '"')
      fs.writeFileSync(
        './src/shared/infra/http/routes/' + routeFileName + '.routes.ts',
        final
      )
    } catch (error) {
      console.log('deu error')
    }

    info(`Generated module ${UseCase} ${Modules}`)
  },
}
