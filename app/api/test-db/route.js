import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET() {
  console.log("🔍 Testing database connection...")
  
  try {
    // Very aggressive 3-second timeout for database operations
    const testPromise = supabase
      .from("workshops")
      .select("count")
      .limit(1)
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database timeout after 3 seconds")), 3000)
    })
    
    const result = await Promise.race([testPromise, timeoutPromise])
    
    console.log("✅ Database connection successful")
    return NextResponse.json({
      success: true,
      message: "Database connection working",
      status: "connected",
      result: result
    })
    
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)
    return NextResponse.json({
      success: false,
      message: "Database connection failed: " + error.message,
      status: "failed",
      fallback: "Using mock mode"
    }, { status: 500 })
  }
}
