const $axios = require('../../plugin/axios');
const { dealCatchError } = require('../../plugin/resProcessor');

module.exports = {
  {{api}}: async (ctx) => {
    try {
      const res = await $axios(ctx, {
        url: {{api}},
        data: ctx.request.body
      });
      res.content = res.content[0];
      ctx.send({ ...res });
    } catch (err) {
      dealCatchError(ctx, err);
    }
  }
};