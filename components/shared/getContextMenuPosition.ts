interface MenuPosition {
  left: number
  top: number
}

export function getContextMenuPosition(
  x: number,
  y: number,
  itemCount: number
): MenuPosition {
  const adjustedPosition: MenuPosition = { left: x, top: y }

  if (typeof window !== 'undefined') {
    const menuWidth = 180
    const menuHeight = itemCount * 36 + 16

    if (x + menuWidth > window.innerWidth) {
      adjustedPosition.left = window.innerWidth - menuWidth - 8
    }

    if (y + menuHeight > window.innerHeight) {
      adjustedPosition.top = window.innerHeight - menuHeight - 8
    }
  }

  return adjustedPosition
}
