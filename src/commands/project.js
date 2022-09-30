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
    const { parameters, template, print, filesystem } = toolbox

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
        baseTemplate: '/project/application/core/repositories',
        baseTarget: `${projectName}/src/core/repositories`,
      },
      {
        baseTemplate: '/project/application/core/repositories/implementation',
        baseTarget: `${projectName}/src/core/repositories/implementation`,
      },
      {
        baseTemplate: '/project/application/base/abstract',
        baseTarget: `${projectName}/src/base/abstract`,
      },
      {
        baseTemplate: '/project/application/base/errors',
        baseTarget: `${projectName}/src/base/errors`,
      },
      {
        baseTemplate: '/project/application/base/interface',
        baseTarget: `${projectName}/src/base/interface`,
      },
    ]

    for (const piece of projectTemplates) {
      autoGenerate({
        ...piece,
        generate,
        props,
      })
    }
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
