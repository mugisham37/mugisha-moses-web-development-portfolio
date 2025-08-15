# Enhanced Windows Development Script for Next.js Portfolio
# Handles environment setup, dependency management, and development server startup

Write-Host "🚀 Starting Brutalist Portfolio Development Environment..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not available" -ForegroundColor Red
    exit 1
}

# Check for .env.local file
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local file not found" -ForegroundColor Yellow
    Write-Host "Creating .env.local from .env.example..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host "✅ .env.local created. Please configure your environment variables." -ForegroundColor Green
        Write-Host "Opening .env.local for editing..." -ForegroundColor Yellow
        Start-Process notepad ".env.local"
        Write-Host "Press any key to continue after configuring .env.local..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    } else {
        Write-Host "❌ .env.example not found" -ForegroundColor Red
        exit 1
    }
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
}

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Blue
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma client generated successfully" -ForegroundColor Green

# Check database connection (optional)
Write-Host "🔍 Checking database connection..." -ForegroundColor Blue
try {
    npx prisma db push --accept-data-loss 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database connection successful" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Database connection failed - continuing without database" -ForegroundColor Yellow
        Write-Host "Make sure your DATABASE_URL is configured correctly in .env.local" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Database connection failed - continuing without database" -ForegroundColor Yellow
}

# Clear Next.js cache
Write-Host "🧹 Clearing Next.js cache..." -ForegroundColor Blue
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}

# Clear TypeScript build info
if (Test-Path "tsconfig.tsbuildinfo") {
    Remove-Item -Force "tsconfig.tsbuildinfo"
}

# Start development server
Write-Host ""
Write-Host "🎉 Starting development server..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
Write-Host "RECOMMENDATIONS:" -ForegroundColor Cyan
Write-Host "1. Add your project folder to Windows Defender exclusions for better performance" -ForegroundColor White
Write-Host "2. Ensure your project is on a local drive (not network drive)" -ForegroundColor White
Write-Host ""

# Use standard Next.js dev server (Turbopack has JSX runtime issues)
next dev
