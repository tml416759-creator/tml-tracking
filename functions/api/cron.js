// Cloudflare Pages Function - Cron 触发器
// 路径: /api/cron
// 在 wrangler.toml 或 Cloudflare Dashboard 配置: crons = ["0 3 * * *"]

export async function onRequestPost(context) {
  const { env } = context;
  try {
    const data = await env.TRACKING_KV.get('data');
    if (!data) {
      return new Response(JSON.stringify({ success: false, reason: '没有数据' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 创建每日备份（保留 30 天）
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const backupKey = `daily_backup_${date}`;
    await env.TRACKING_KV.put(backupKey, data, {
      expirationTtl: 60 * 60 * 24 * 30
    });

    // 记录最后备份时间
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
  return onRequestPost(context);
}
