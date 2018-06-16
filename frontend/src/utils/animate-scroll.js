import * as easings from 'utils/easings'

const getNow = () => (
  'now' in window.performance ? performance.now() : new Date().getTime()
)

export default function animateScroll ({
  container,
  target,
  duration = 200,
  easing = 'easeOutQuad'
}) {
  const startTime = getNow()
  const startPosition = container.scrollTop
  const endPosition = target.offsetTop

  if (duration === 0) {
    container.scrollTop = endPosition

    return Promise.resolve()
  }

  const scroll = (resolve) => {
    const now = getNow()
    const time = Math.min(1, ((now - startTime) / duration))
    const positionDiff = endPosition - startPosition

    const newScrollTop = (easings[easing](time) * positionDiff) + startPosition
    container.scrollTop = Math.ceil(newScrollTop)

    if (container.scrollTop >= endPosition) {
      return resolve()
    }

    requestAnimationFrame(() => scroll(resolve))
  }

  return new Promise((resolve) => scroll(resolve))
}
