import bcrypt from 'bcrypt'
import { Kysely, PostgresDialect, Generated } from 'kysely'
import { Pool } from 'pg'
import * as readline from 'readline'

interface Database {
  user: {
    id: Generated<number>
    username: string
    password: string
    created_at: Generated<Date>
    updated_at: Generated<Date>
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function createUser() {
  // Get database connection details from environment
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        user: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'hann',
      }),
    }),
  })

  try {
    const username = await question('Enter username: ')
    const password = await question('Enter password: ')

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user
    const result = await db
      .insertInto('user')
      .values({
        username,
        password: hashedPassword,
      })
      .returningAll()
      .executeTakeFirstOrThrow()

    console.log('\n✓ User created successfully:')
    console.log(`  ID: ${result.id}`)
    console.log(`  Username: ${result.username}`)
    console.log(`  Created at: ${result.created_at}`)
  } catch (error: any) {
    if (error.code === '23505') {
      console.error('\n✗ Error: Username already exists')
    } else {
      console.error('\n✗ Error creating user:', error.message)
    }
  } finally {
    await db.destroy()
    rl.close()
  }
}

createUser()
