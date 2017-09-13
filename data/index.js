var buildSearch = require('../src/utils/build-search')
var data = require('./data')

function uncompress (list) {
  for (var short_name in list) {
    var datum = list[short_name]

    if (!datum.short_names) datum.short_names = []
    datum.short_names.unshift(short_name)

    datum.sheet_x = datum.sheet[0]
    datum.sheet_y = datum.sheet[1]
    delete datum.sheet

    if (!datum.text) datum.text = ''
    if (datum.added_in !== null && !datum.added_in) datum.added_in = '6.0'

    datum.search = buildSearch({
      short_names: datum.short_names,
      name: datum.name,
      keywords: datum.keywords,
      emoticons: datum.emoticons
    })

    datum.search = datum.search.join(',')
  }
}

uncompress(data.emojis)
uncompress(data.skins)

module.exports = data
