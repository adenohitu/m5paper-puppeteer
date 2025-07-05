#!/bin/bash

# M5Paper Puppeteer Screenshot API Development Script

echo "🚀 M5Paper Puppeteer Screenshot API"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Install dependencies if not exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
fi

# Build the project
echo "🔨 Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build completed"

# Start development server
echo "🚀 Starting development server..."
echo "📱 Frontend: http://localhost:3000"
echo "🔌 API: http://localhost:3000/screenshot"
echo "📚 Docs: http://localhost:3000/api-docs"
echo "❤️ Health: http://localhost:3000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
