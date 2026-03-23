#!/bin/bash

# Infinity Gauntlet 3D - Startup Script
# This script starts the local development server

echo "🚀 Starting Infinity Gauntlet 3D Experience..."
echo "=============================================="

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found"
    echo "🌐 Starting server on http://localhost:8000"
    echo "📱 Open in browser: http://localhost:8000"
    echo "⏹️  Press Ctrl+C to stop the server"
    echo ""
    echo "🎮 Launch the experience:"
    echo "   • Main App: http://localhost:8000/index.html"
    echo "   • Demo Page: http://localhost:8000/demo.html"
    echo ""
    echo "=============================================="
    
    # Start the server
    python3 server.py
elif command -v python &> /dev/null; then
    echo "✅ Python found"
    echo "🌐 Starting server on http://localhost:8000"
    echo "📱 Open in browser: http://localhost:8000"
    echo "⏹️  Press Ctrl+C to stop the server"
    echo ""
    echo "🎮 Launch the experience:"
    echo "   • Main App: http://localhost:8000/index.html"
    echo "   • Demo Page: http://localhost:8000/demo.html"
    echo ""
    echo "=============================================="
    
    # Start the server
    python server.py
else
    echo "❌ Python not found"
    echo "💡 Please install Python 3 to run the server"
    echo "   • macOS: brew install python3"
    echo "   • Ubuntu: sudo apt install python3"
    echo "   • Windows: Download from python.org"
    exit 1
fi
