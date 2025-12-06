import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 判断运行环境
    const backendUrl =
      process.env.NODE_ENV === "development"
        ? "http://nginx/login"      // 本地跑 FastAPI
        : "http://nginx/login";               // Docker & nginx 代理

    const apiRes = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // 转发前端请求 Body
      body: JSON.stringify(req.body),
      // 🔥 关键点：允许接收后端 Set-Cookie
      credentials: "include",
    });

    // 取回 Set-Cookie 并透传给前端浏览器
    const setCookie = apiRes.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);

  } catch (error: any) {
    console.error("Login proxy error:", error);
    return res.status(500).json({
      message: "登录接口代理失败",
      error: error.message,
    });
  }
};

export default handler;
