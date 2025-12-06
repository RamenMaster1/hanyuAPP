import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 后端地址切换（本地开发 vs docker 部署）
    const backendUrl =
      process.env.NODE_ENV === "development"
        ? "http://nginx/register"   // 本地直连 FastAPI
        : "http://nginx/register";           // docker 中通过 nginx

    const apiRes = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
      credentials: "include",
    });

    // 转发 cookie（虽然注册接口一般不用）
    const setCookie = apiRes.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);

  } catch (error: any) {
    console.error("Register proxy error:", error);
    return res.status(500).json({
      message: "注册接口代理失败",
      error: error.message,
    });
  }
};

export default handler;
