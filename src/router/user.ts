import { Context } from "koa";
import Router from "koa-router";
import { success } from "../common/ResResult";
const router = new Router();

router.prefix("/user");

router.get("/findUserInfo/:username", async (ctx: Context) => {
  const { username } = ctx.params;
  ctx.body = success(`欢迎!${username}`);
});

router.post("/addUser", async (ctx: Context) => {
  const user = ctx.request.body;
  ctx.body = `欢迎!${user.username}`;
});


module.exports = router;
