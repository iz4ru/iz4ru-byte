'use client'

import { useEffect, useState } from 'react'

const TEXTS = ['iz4ru.byte', 'developer.', 'writer.', 'builder.']
const TYPE_SPEED = 80
const DELETE_SPEED = 50
const PAUSE = 1800

export function Typewriter() {
  const [displayed, setDisplayed] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = TEXTS[textIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, displayed.length + 1))
        if (displayed.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), PAUSE)
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1))
        if (displayed.length - 1 === 0) {
          setIsDeleting(false)
          setTextIndex((i) => (i + 1) % TEXTS.length)
        }
      }
    }, isDeleting ? DELETE_SPEED : TYPE_SPEED)

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, textIndex])

  return (
    <h1 className="text-4xl lg:text-5xl font-bold font-mono text-accent mb-4">
      {displayed}
      <span className="animate-cursor text-accent/50">|</span>
    </h1>
  )
}