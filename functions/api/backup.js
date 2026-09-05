// Cloudflare Pages Function - 立即备份
// 路径: /api/backup

export async function onRequestPost(context) {
  const { env } = context;
  try {
    const data = await env.TRACKING_KV.get('data');
    if (!data) {
      return new Response(JSON.stringify({ success: false, error: '没有数据' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 备份到独立的 key，加时间戳
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupKey = `backup_${timestamp}`;
    await env.TRACKING_KV.put(backupKey, data, {
      expirationTtl: 60 * 60 * 24 * 30 // 30 天后过期
    });

    // 同时记录最后一次备份时间
    await env.TRACKING_KV.put('lastBackup', new Date().toISOString());

    return new Response(JSON.stringify({ success: true, key: backupKey }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestGet(context) {
  // GET 也支持（方便测试）
  return onRequestPost(context);
}
