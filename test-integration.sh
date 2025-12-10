#!/bin/bash

# Habit Breaker - Integration Test Script
# 測試 Extension → Backend → LLM 完整流程

echo ""
echo "🚀 ══════════════════════════════════════════════════════"
echo "   Habit Breaker - Integration Test"
echo "   ══════════════════════════════════════════════════════"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Check if backend is running
echo -e "${BLUE}Test 1: Backend Health Check${NC}"
HEALTH_RESPONSE=$(curl -s http://localhost:3000/health)
if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo -e "${GREEN}✅ Backend is running${NC}"
    echo "   Response: $HEALTH_RESPONSE"
else
    echo -e "${RED}❌ Backend is NOT running${NC}"
    echo -e "${YELLOW}   Please run: cd backend && node server.js${NC}"
    exit 1
fi
echo ""

# Test 2: Test LLM Intervention Generation (Instagram)
echo -e "${BLUE}Test 2: LLM Intervention Generation - Instagram${NC}"
INSTAGRAM_RESPONSE=$(curl -s -X POST http://localhost:3000/api/generate-intervention \
  -H "Content-Type: application/json" \
  -d '{"site":"instagram.com","timeSpent":120,"visitCount":3,"currentTime":"14:30"}')

if echo "$INSTAGRAM_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Instagram intervention generated${NC}"
    echo "   Message: $(echo $INSTAGRAM_RESPONSE | grep -o '"message":"[^"]*"' | cut -d'"' -f4)"
    echo "   Audio: $(echo $INSTAGRAM_RESPONSE | grep -o '"audioFile":"[^"]*"' | cut -d'"' -f4)"
else
    echo -e "${RED}❌ Failed to generate Instagram intervention${NC}"
    echo "   Response: $INSTAGRAM_RESPONSE"
fi
echo ""

# Test 3: Test LLM Intervention Generation (TikTok)
echo -e "${BLUE}Test 3: LLM Intervention Generation - TikTok${NC}"
TIKTOK_RESPONSE=$(curl -s -X POST http://localhost:3000/api/generate-intervention \
  -H "Content-Type: application/json" \
  -d '{"site":"tiktok.com","timeSpent":180,"visitCount":5,"currentTime":"15:45"}')

if echo "$TIKTOK_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ TikTok intervention generated${NC}"
    echo "   Message: $(echo $TIKTOK_RESPONSE | grep -o '"message":"[^"]*"' | cut -d'"' -f4)"
    echo "   Audio: $(echo $TIKTOK_RESPONSE | grep -o '"audioFile":"[^"]*"' | cut -d'"' -f4)"
else
    echo -e "${RED}❌ Failed to generate TikTok intervention${NC}"
fi
echo ""

# Test 4: Test LLM Behavior Analysis
echo -e "${BLUE}Test 4: LLM Behavior Analysis${NC}"
ANALYSIS_RESPONSE=$(curl -s -X POST http://localhost:3000/api/should-intervene \
  -H "Content-Type: application/json" \
  -d '{"site":"youtube.com","timeSpent":300,"actions":"scrolling","scrollSpeed":"fast"}')

if echo "$ANALYSIS_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Behavior analysis completed${NC}"
    SHOULD_INTERVENE=$(echo $ANALYSIS_RESPONSE | grep -o '"shouldIntervene":[^,}]*' | cut -d':' -f2)
    echo "   Should intervene: $SHOULD_INTERVENE"
    echo "   Reason: $(echo $ANALYSIS_RESPONSE | grep -o '"reason":"[^"]*"' | cut -d'"' -f4)"
else
    echo -e "${RED}❌ Failed to analyze behavior${NC}"
fi
echo ""

# Test 5: Test Stats Endpoint
echo -e "${BLUE}Test 5: Stats Endpoint${NC}"
STATS_RESPONSE=$(curl -s http://localhost:3000/api/stats)
if echo "$STATS_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Stats retrieved successfully${NC}"
    echo "   $STATS_RESPONSE"
else
    echo -e "${RED}❌ Failed to get stats${NC}"
fi
echo ""

# Test 6: Check Audio Files
echo -e "${BLUE}Test 6: Audio Files Check${NC}"
AUDIO_DIR="extension/assets/voices"
REQUIRED_FILES=("mom-instagram-en.mp3" "mom-facebook-en.mp3" "mom-shopping-en.mp3" "coach-tiktok-en.mp3")

ALL_PRESENT=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$AUDIO_DIR/$file" ]; then
        echo -e "${GREEN}✅ Found: $file${NC}"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
        ALL_PRESENT=false
    fi
done
echo ""

# Test 7: Test multiple interventions (dynamic messages)
echo -e "${BLUE}Test 7: Dynamic Message Generation (3 calls)${NC}"
echo "Testing if LLM generates different messages for the same scenario..."
for i in {1..3}; do
    RESPONSE=$(curl -s -X POST http://localhost:3000/api/generate-intervention \
      -H "Content-Type: application/json" \
      -d '{"site":"facebook.com","timeSpent":150,"visitCount":2,"currentTime":"16:00"}')
    MESSAGE=$(echo $RESPONSE | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
    echo "   Call $i: $MESSAGE"
done
echo ""

# Summary
echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Integration Test Complete!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "   1. Load extension in Chrome:"
echo "      chrome://extensions → Load unpacked → Select 'extension' folder"
echo "   2. Visit Instagram/TikTok/Facebook"
echo "   3. Wait 10 seconds"
echo "   4. You should see:"
echo "      • Dynamic LLM-generated message"
echo "      • Voice audio playing"
echo "      • Intervention overlay"
echo ""
echo -e "${YELLOW}To monitor backend logs:${NC}"
echo "   tail -f /tmp/habit-breaker-server.log"
echo ""
echo "══════════════════════════════════════════════════════"
echo ""

