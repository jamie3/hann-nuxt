export default defineEventHandler(async (event) => {
  const db = useDB()
  
  try {
    // Test database connection by running a simple query
    await db.selectFrom('user').select('id').limit(1).execute()
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      service: 'operational',
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Health check failed',
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
})
