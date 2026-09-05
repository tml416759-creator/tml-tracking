// Cloudflare Pages Function - 获取/保存包裹数据
// 路径: /api/packages

const ADMIN_PIN = '2022'; // 初始 PIN

export async function onRequestGet(context) {
  const { env } = context;
  try {
    // 从 KV 读取
    const data = await env.TRACKING_KV.get('data');
    if (!data) {
      return new Response(JSON.stringify({ packages: [], settings: null }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(data, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const { packages, settings, pin } = body;

    // 验证 PIN
    const stored = await env.TRACKING_KV.get('settings');
    let currentPin = ADMIN_PIN;
    if (stored) {
      const s = JSON.parse(stored);
      currentPin = s.superPin || ADMIN_PIN;
    }
    if (pin !== currentPin) {
      return new Response(JSON.stringify({ error: 'PIN 无效' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 保存数据
    const dataToStore = JSON.stringify({ packages, settings });
    await env.TRACKING_KV.put('data', dataToStore);
    await env.TRACKING_KV.put('settings', JSON.stringify(settings));

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
