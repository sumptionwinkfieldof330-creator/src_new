/**
 * Tạo header.png (3620×1177) từ banner_meta.jpg:
 * - Nền mở rộng (blur từ banner gốc)
 * - Nội dung chính trong vùng an toàn, không kéo giãn
 */
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SRC = path.join(ROOT, 'public/images/meta/banner_meta.jpg')
const OUT = path.join(ROOT, 'public/images/meta/header.png')

const TARGET_W = 3620
const TARGET_H = 1177
/** Vùng an toàn: ~94% ngang / ~96% cao — giữ lề hai bên cho mobile crop */
const SAFE_W_RATIO = 0.94
const SAFE_H_RATIO = 0.96

async function main() {
  const source = sharp(SRC)
  const meta = await source.metadata()
  const safeW = Math.round(TARGET_W * SAFE_W_RATIO)
  const safeH = Math.round(TARGET_H * SAFE_H_RATIO)

  // Nền: phủ toàn canvas, làm mờ để mở rộng gradient thương hiệu
  const background = await source
    .clone()
    .resize(TARGET_W, TARGET_H, { fit: 'cover', position: 'centre' })
    .blur(22)
    .modulate({ brightness: 1.03, saturation: 0.95 })
    .toBuffer()

  // Lớp nền phụ: gradient nhẹ trên/dưới (tăng chiều cao cảm giác cao cấp)
  const gradientSvg = Buffer.from(`
    <svg width="${TARGET_W}" height="${TARGET_H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#e8f2ff" stop-opacity="0.55"/>
          <stop offset="35%" stop-color="#ffffff" stop-opacity="0"/>
          <stop offset="65%" stop-color="#ffffff" stop-opacity="0"/>
          <stop offset="100%" stop-color="#dce8fa" stop-opacity="0.45"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>
  `)

  // Tiền cảnh: giữ tỷ lệ, vừa vùng an toàn, sắc nét
  const foreground = await source
    .clone()
    .resize(safeW, safeH, {
      fit: 'inside',
      withoutEnlargement: false,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .sharpen({ sigma: 0.65, m1: 0.5, m2: 0.35 })
    .toBuffer()

  const fgMeta = await sharp(foreground).metadata()
  const left = Math.round((TARGET_W - fgMeta.width) / 2)
  const top = Math.round((TARGET_H - fgMeta.height) / 2)

  // Viền mờ hai bên (vignette nhẹ) — nhấn vùng trung tâm
  const vignetteSvg = Buffer.from(`
    <svg width="${TARGET_W}" height="${TARGET_H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#f0f6ff" stop-opacity="0.7"/>
          <stop offset="12%" stop-color="#ffffff" stop-opacity="0"/>
          <stop offset="88%" stop-color="#ffffff" stop-opacity="0"/>
          <stop offset="100%" stop-color="#f0f6ff" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#l)"/>
    </svg>
  `)

  await sharp(background)
    .composite([
      { input: foreground, left, top },
      { input: gradientSvg, blend: 'over' },
      { input: vignetteSvg, blend: 'over' },
    ])
    .png({ compressionLevel: 6, effort: 10 })
    .toFile(OUT)

  const outMeta = await sharp(OUT).metadata()
  console.log(`Source: ${meta.width}×${meta.height}`)
  console.log(`Foreground in safe zone: ${fgMeta.width}×${fgMeta.height} @ (${left}, ${top})`)
  console.log(`Output: ${outMeta.width}×${outMeta.height} -> ${OUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
