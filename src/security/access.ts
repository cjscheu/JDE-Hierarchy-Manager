export type AccessRole = 'basic' | 'power' | 'admin' | 'super'

let currentAccessRole: AccessRole = 'basic'

export function setCurrentAccessRole(role: AccessRole) {
  currentAccessRole = role
}

export function getCurrentAccessRole() {
  return currentAccessRole
}

export function canDeleteAnyRecord() {
  return currentAccessRole === 'super'
}
