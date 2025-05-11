// 此文件用于生成基本的图标
// 可以使用 Canvas API 创建简单的图标
// 稍后可以用实际设计的图标替换

const fs = require('fs');
const { createCanvas } = require('canvas');

// 生成图标尺寸数组
const sizes = [16, 48, 128];

// 为每个尺寸创建图标
for (const size of sizes) {
  // 创建画布
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // 背景
  ctx.fillStyle = '#4285f4';  // Google 蓝色
  ctx.fillRect(0, 0, size, size);
  
  // 边框
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(1, Math.floor(size / 16));
  ctx.strokeRect(ctx.lineWidth/2, ctx.lineWidth/2, size - ctx.lineWidth, size - ctx.lineWidth);
  
  // "MD" 文字
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${Math.floor(size * 0.6)}px Arial`;
  ctx.fillText('MD', size/2, size/2);
  
  // 将图标保存为文件
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`./src/assets/icon${size}.png`, buffer);
  
  console.log(`已生成 ${size}x${size} 图标`);
}

console.log('所有图标已生成');
