const moment = require('moment');

function asMoment(value) {
  if (!value) return null;
  const parsed = moment(value);
  return parsed.isValid() ? parsed : null;
}

hexo.extend.filter.register('before_post_render', function(data) {
  data.updated = asMoment(data.updated) || asMoment(data.date) || moment();

  return data;
});
