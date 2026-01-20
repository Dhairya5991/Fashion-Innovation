import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Pose } from '@mediapipe/pose'
import { Camera as MP_Camera } from '@mediapipe/camera_utils'

export default function ARMirror({ modelUrl }){
  const containerRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(()=>{
    if (!containerRef.current) return

    let renderer, scene, camera3D, model, loader, animationId
    let video = videoRef.current
    const width = 640
    const height = 480

    // Setup Three
    scene = new THREE.Scene()
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
    containerRef.current.appendChild(renderer.domElement)

    // Orthographic camera to map pixels directly
    camera3D = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -1000, 1000)
    camera3D.position.z = 100

    const ambient = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambient)
    const dir = new THREE.DirectionalLight(0xffffff, 0.6)
    dir.position.set(0, 0, 1)
    scene.add(dir)

    // Placeholder cube while model loads
    const placeholder = new THREE.Mesh(new THREE.BoxGeometry(100,150,10), new THREE.MeshStandardMaterial({ color: 0xff5555, transparent: true, opacity: 0.7 }))
    placeholder.position.set(0,0,0)
    scene.add(placeholder)
    model = placeholder

    loader = new GLTFLoader()
    if (modelUrl) {
      loader.load(modelUrl, (gltf) => {
        if (placeholder && scene.children.includes(placeholder)) {
          scene.remove(placeholder)
        }
        model = gltf.scene
        model.traverse((c)=>{ if (c.isMesh) c.castShadow = false })
        scene.add(model)
      }, undefined, (e)=>{
        console.warn('GLTF load error', e)
      })
    }

    // MediaPipe Pose setup
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    })
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    })

    pose.onResults((results) => {
      if (!results.poseLandmarks) return
      const lm = results.poseLandmarks
      const left = lm[11]
      const right = lm[12]
      const midX = (left.x + right.x) / 2
      const midY = (left.y + right.y) / 2
      const shoulderDist = Math.hypot((left.x - right.x), (left.y - right.y))

      // Map to three coordinates (pixel-based orthographic)
      const px = (midX - 0.5) * width
      const py = -(midY - 0.5) * height

      if (model) {
        model.position.x = px
        model.position.y = py
        const scale = Math.max(0.5, shoulderDist * width * 0.01)
        model.scale.setScalar(scale)
      }
      // compute additional metrics: torso length estimate using shoulders and hips
      const leftHip = lm[23]
      const rightHip = lm[24]
      const midHipY = (leftHip.y + rightHip.y) / 2
      const torsoLen = Math.abs(midHipY - midY)
      // dispatch pose metrics for size recommendation
      try {
        window.dispatchEvent(new CustomEvent('poseMetrics', { detail: { shoulderDist, torsoLen, midX, midY } }))
      } catch (e) {}
    })

    // start camera
    let mpCamera
    async function startCamera(){
      if (!navigator.mediaDevices) return
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width, height } })
      video.srcObject = stream
      await video.play()
      mpCamera = new MP_Camera(video, { onFrame: async () => { await pose.send({ image: video }) }, width, height })
      mpCamera.start()
    }

    startCamera().catch(console.warn)

    // render loop
    function animate(){
      animationId = requestAnimationFrame(animate)
      renderer.render(scene, camera3D)
    }
    animate()

    return ()=>{
      cancelAnimationFrame(animationId)
      if (mpCamera && mpCamera.stop) mpCamera.stop()
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks()
        tracks.forEach(t => t.stop())
      }
      if (renderer) {
        renderer.dispose()
        // Safely remove renderer DOM element
        if (renderer.domElement && renderer.domElement.parentNode) {
          try {
            renderer.domElement.parentNode.removeChild(renderer.domElement)
          } catch (e) {
            // Element might already be removed, ignore
          }
        }
      }
    }
  }, [modelUrl])

  return (
    <div style={{position:'relative', width:640, height:480}} className="mx-auto">
      <video ref={videoRef} playsInline muted style={{width:640, height:480, objectFit:'cover'}} />
      <div ref={containerRef} style={{pointerEvents:'none', width:640, height:480}} />
    </div>
  )
}
