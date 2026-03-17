import type { Category, AssetClass, Institution } from '@/types'
import { mockCategories, mockAssetClasses, mockInstitutions } from './mock-data'

function key(email: string, entity: string) {
  return `mdd_${email}_${entity}`
}

export function initUserData(email: string): void {
  if (localStorage.getItem(key(email, 'initialized'))) return
  localStorage.setItem(key(email, 'categories'), JSON.stringify(mockCategories))
  localStorage.setItem(key(email, 'assetClasses'), JSON.stringify(mockAssetClasses))
  localStorage.setItem(key(email, 'institutions'), JSON.stringify(mockInstitutions))
  localStorage.setItem(key(email, 'products'), JSON.stringify([]))
  localStorage.setItem(key(email, 'initialized'), '1')
}

export function getCategories(email: string): Category[] {
  const d = localStorage.getItem(key(email, 'categories'))
  return d ? JSON.parse(d) : []
}

export function setCategories(email: string, items: Category[]): void {
  localStorage.setItem(key(email, 'categories'), JSON.stringify(items))
}

export function getAssetClasses(email: string): AssetClass[] {
  const d = localStorage.getItem(key(email, 'assetClasses'))
  return d ? JSON.parse(d) : []
}

export function setAssetClasses(email: string, items: AssetClass[]): void {
  localStorage.setItem(key(email, 'assetClasses'), JSON.stringify(items))
}

export function getInstitutions(email: string): Institution[] {
  const d = localStorage.getItem(key(email, 'institutions'))
  return d ? JSON.parse(d) : []
}

export function setInstitutions(email: string, items: Institution[]): void {
  localStorage.setItem(key(email, 'institutions'), JSON.stringify(items))
}

export function deleteUserData(email: string): void {
  ['categories', 'assetClasses', 'institutions', 'products', 'initialized'].forEach(e => {
    localStorage.removeItem(key(email, e))
  })
}
