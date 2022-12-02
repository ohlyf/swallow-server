import fs from "fs";
import path from "path";
import Router from "koa-router";
import body from "koa-body";
import json from "koa-json";
import Koa from "koa";
class AllRouterLoader {
  app!: Koa;
  static allRouterLoader = new AllRouterLoader();
  // 初始化方法
  init(app: Koa) {
    this.app = app;
    const rootRouter = this.loadAllRouterWrapper();
    this.app.use(rootRouter.routes());
    this.listen();
  }

  // 1. 加载所有路由文件数组
  getFiles(dir: string) {
    return fs.readdirSync(dir);
  }
  // 2. 加载所有路由文件绝对路径数组
  getAbsoluteFilePaths() {
    const dir = path.join(process.cwd(), "/src/router");
    const allFiles = this.getFiles(dir);
    const allFullFilePaths: string[] = [];
    for (const file of allFiles) {
      const fullFilePath = dir + "/" + allFiles;
      allFullFilePaths.push(fullFilePath);
    }
    return allFullFilePaths;
  }

  // 获取更目录
  getRootRouter() {
    const rootRouter = new Router();
    rootRouter.prefix("/swallow");
    this.app.use(json());
    this.app.use(body());
    return rootRouter;
  }
  // 自定义守卫
  isRouter(data: any): data is Router {
    return data instanceof Router;
  }

  // 3. 加载所有二级路由到一级路由中
  loadAllRouter(allFullFilePaths: string[], rootRouter: Router) {
    for (const fullFilePath of allFullFilePaths) {
      const module = require(fullFilePath);
      if (this.isRouter(module)) {
        rootRouter.use(module.routes(), module.allowedMethods());
      }
    }
  }

  loadAllRouterWrapper() {
    // 先获取一级路由
    const rootRouter = this.getRootRouter();
    /* 调用获取绝对路径数组方法  调用加载所有二级路由到一级路由方法 */
    const allFullFilePaths = this.getAbsoluteFilePaths();

    this.loadAllRouter(allFullFilePaths, rootRouter);
    return rootRouter;
  }

  listen() {
    this.app.listen(3002);
  }
}

export default AllRouterLoader.allRouterLoader;
