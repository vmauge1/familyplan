import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const jsonPath = 'C:/Users/marie/Downloads/familyplan-1e5b7-firebase-adminsdk-fbsvc-93069447e4.json'
const content  = readFileSync(jsonPath, 'utf8').replace(/\s+/g, ' ').trim()

// Écrire dans un fichier .env temporaire pour éviter les problèmes de quotes
const envContent = `FIREBASE_SERVICE_ACCOUNT=${content}\n`
const tmpPath = resolve(__dirname, '../.secrets.tmp')
writeFileSync(tmpPath, envContent)

console.log('Envoi du secret à Supabase...')
execSync('npx supabase secrets set --env-file .secrets.tmp', { stdio: 'inherit' })

// Supprimer le fichier temporaire
import { unlinkSync } from 'fs'
unlinkSync(tmpPath)
console.log('✓ Secret configuré, fichier temporaire supprimé.')
