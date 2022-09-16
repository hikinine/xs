const command = {
  name: 'xs',
  run: async (toolbox) => {
    const { print } = toolbox

    print.info('Snippets XS')
  },
}

module.exports = command
