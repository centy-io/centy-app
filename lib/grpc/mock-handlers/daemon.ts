'use client'

// Operations that don't make sense in demo mode

export async function shutdown(): Promise<{
  success: boolean
  message: string
}> {
  console.warn('[Demo Mode] shutdown called - not available in demo mode')
  return {
    success: false,
    message: 'Not available in demo mode',
  }
}

export async function restart(): Promise<{
  success: boolean
  message: string
}> {
  console.warn('[Demo Mode] restart called - not available in demo mode')
  return {
    success: false,
    message: 'Not available in demo mode',
  }
}

export async function init(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] init called - not available in demo mode')
  return { success: true }
}

export async function registerProject(): Promise<{
  success: boolean
}> {
  console.warn(
    '[Demo Mode] registerProject called - not available in demo mode'
  )
  return { success: true }
}

export async function untrackProject(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] untrackProject called - not available in demo mode')
  return { success: true }
}

export async function setProjectFavorite(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] setProjectFavorite called - changes not persisted')
  return { success: true }
}

export async function setProjectArchived(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] setProjectArchived called - changes not persisted')
  return { success: true }
}

export async function setProjectOrganization(): Promise<{
  success: boolean
}> {
  console.warn(
    '[Demo Mode] setProjectOrganization called - changes not persisted'
  )
  return { success: true }
}

export async function setProjectUserTitle(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] setProjectUserTitle called - changes not persisted')
  return { success: true }
}

export async function setProjectTitle(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] setProjectTitle called - changes not persisted')
  return { success: true }
}
