import * as tf from '@tensorflow/tfjs'

// Lightweight TF.js-backed size recommendation using simple linear model (heuristic weights)
// Accepts metrics: { shoulderDist, torsoLen }

export function recommendSize(metrics) {
  // normalize inputs (expected normalized landmarks between 0..1)
  const s = metrics.shoulderDist || 0
  const t = metrics.torsoLen || 0
  // simple linear combination using tf ops
  return tf.tidy(() => {
    const x = tf.tensor2d([[s, t]]) // shape [1,2]
    // heuristic weights and bias chosen to map to size index
    const W = tf.tensor2d([[30],[20]]) // weights shape [2,1]
    const b = tf.scalar(0.5)
    const raw = x.matMul(W).add(b)
    const val = raw.dataSync()[0]
    // thresholds to sizes — these are heuristic and should be tuned with real data
    if (val < 10) return { size: 'XS', score: val }
    if (val < 18) return { size: 'S', score: val }
    if (val < 26) return { size: 'M', score: val }
    if (val < 34) return { size: 'L', score: val }
    return { size: 'XL', score: val }
  })
}
