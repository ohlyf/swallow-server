import Koa, { Context } from "koa";
import { success, fail } from "./ResResult";

const globalException = async (ctx: Context, next: Koa.Next) => {
  try {
    await next();
  } catch (err: any) {
    const errResult = err as { message: string };
    ctx.body = fail(`服务器错误:${errResult.message}`);
  }
};

export default globalException;
