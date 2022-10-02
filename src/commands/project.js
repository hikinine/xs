const { capitalize } = require('../utils/capitalize')
const fs = require('fs')
const { resolve } = require('path')
const optionValue = (option) => {
  if (!option) return void 1

  if (option === 'false' || option === false) {
    return false
  }
}

const generateDefaultOptions = (options) => {
  return {
    typescript: true,
  }
}

module.exports = {
  name: 'new:project',
  alias: ['project'],
  run: async (toolbox) => {
    const { parameters, template, print, filesystem, system } = toolbox

    const { generate } = template
    const { info } = print

    const projectName = parameters.first

    if (!projectName) {
      return info('one arguments expected')
    }

    const props = { projectName }

    const projectTemplates = [
      {
        baseTemplate: '/project/database/',
        baseTarget: `${projectName}/src/shared/infra/database/prisma/`,
      },
      {
        baseTemplate: '/project/http/middleware/',
        baseTarget: `${projectName}/src/shared/infra/http/middleware/`,
      },
      {
        baseTemplate: '/project/http/',
        baseTarget: `${projectName}/src/shared/infra/http/`,
      },
      {
        baseTemplate: '/project/http/routes/',
        baseTarget: `${projectName}/src/shared/infra/http/routes/`,
      },
      {
        baseTemplate: '/project/config/',
        baseTarget: `${projectName}/src/shared/infra/config`,
      },
      {
        baseTemplate: '/project/initial/',
        baseTarget: `${projectName}/src/`,
      },
      {
        baseTemplate: '/project/global',
        baseTarget: `${projectName}/`,
      },
      {
        baseTemplate: '/project/application/core/domain/entities',
        baseTarget: `${projectName}/src/core/domain/entities`,
      },
      {
        baseTemplate: '/project/application/core/domain/interface',
        baseTarget: `${projectName}/src/core/domain/interface`,
      },
      {
        baseTemplate: '/project/application/base/abstract',
        baseTarget: `${projectName}/src/base/abstract`,
      },
      {
        baseTemplate: '/project/application/base/utils',
        baseTarget: `${projectName}/src/base/utils`,
      },
      {
        baseTemplate: '/project/application/base/errors',
        baseTarget: `${projectName}/src/base/errors`,
      },
      {
        baseTemplate: '/project/application/base/interface',
        baseTarget: `${projectName}/src/base/interface`,
      },
      {
        baseTemplate: '/project/application/base',
        baseTarget: `${projectName}/src/base`,
      },
      {
        baseTemplate: '/project/application/core/repositories',
        baseTarget: `${projectName}/src/core/repositories`,
      },
      {
        baseTemplate: '/project/application/core/repositories/implementation',
        baseTarget: `${projectName}/src/core/repositories/implementation`,
      },
      {
        baseTemplate: '/project/application/core/usecase/UserLoginAuthenticate',
        baseTarget: `${projectName}/src/core/usecase/UserLoginAuthenticate`,
      },
      {
        baseTemplate: '/project/application/core/usecase/UserRefreshToken',
        baseTarget: `${projectName}/src/core/usecase/UserRefreshToken`,
      },
    ];

    for (const piece of projectTemplates) {
      autoGenerate({
        ...piece,
        generate,
        props,
      })
    }
    
    info("Instalando dependências")
    await system.run(`cd ${projectName} && yarn install`);
    info("Criando repositórios")
    await system.run(`cd ${projectName} && xs new:repository UserRepository --v2`);
    info("Criando banco de dados")
    await system.run(`cd ${projectName} && yarn prisma db push`);
    //await system.run(`cd ${projectName} && xs new:usecase UserCreate user POST#/#user --v2`);
  },
}

function normalizeBaseTemplate(template) {
  return template.endsWith('/') ? template : template + '/'
}
function autoGenerate({ generate, props, baseTemplate, baseTarget }) {
  const templateFolder = resolve(__dirname, '../templates') + baseTemplate
  const fileNames = fs
    .readdirSync(templateFolder)
    .filter((filename) => filename.endsWith('.ejs'))

  for (const fileName of fileNames) {
    generate({
      template: normalizeBaseTemplate(baseTemplate) + fileName,
      target: normalizeBaseTemplate(baseTarget) + fileName?.replace('.ejs', ''),
      props,
    })
  }
}
