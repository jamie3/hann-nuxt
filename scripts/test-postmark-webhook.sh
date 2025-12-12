#!/bin/bash

# Test Postmark Webhook Endpoint
# This script sends a sample webhook payload to test the endpoint

# Configuration
API_URL="${1:-http://localhost:3000/api/webhooks/postmark}"
API_KEY="${2:-5384883d-1ffd-41cd-95a7-b0900be2ba66}"

echo "Testing Postmark Webhook Endpoint"
echo "URL: $API_URL"
echo "API Key: $API_KEY"
echo ""

# Test 1: Delivery Webhook
echo "Test 1: Delivery Webhook"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "ApiKey: $API_KEY" \
  -d '{
    "RecordType": "Delivery",
    "ServerID": 23,
    "MessageStream": "outbound",
    "MessageID": "test-message-id-12345",
    "Recipient": "john@example.com",
    "Tag": "referral-notification",
    "DeliveredAt": "2025-12-12T10:00:18Z",
    "Details": "Test delivery webhook",
    "Metadata": {
      "test": "value"
    }
  }'

echo -e "\n\n"

# Test 2: Open Webhook
echo "Test 2: Open Webhook"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "ApiKey: $API_KEY" \
  -d '{
    "RecordType": "Open",
    "ServerID": 23,
    "MessageStream": "outbound",
    "MessageID": "test-message-id-12345",
    "Recipient": "john@example.com",
    "Tag": "referral-notification",
    "ReceivedAt": "2025-12-12T10:05:18Z",
    "Metadata": {
      "test": "value"
    }
  }'

echo -e "\n\n"

# Test 3: Click Webhook
echo "Test 3: Click Webhook"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "ApiKey: $API_KEY" \
  -d '{
    "RecordType": "Click",
    "ServerID": 23,
    "MessageStream": "outbound",
    "MessageID": "test-message-id-12345",
    "Recipient": "john@example.com",
    "Tag": "referral-notification",
    "ClickedAt": "2025-12-12T10:10:18Z",
    "Metadata": {
      "test": "value"
    }
  }'

echo -e "\n\n"

# Test 4: Invalid API Key (should fail)
echo "Test 4: Invalid API Key (should return 401)"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "ApiKey: invalid-key" \
  -d '{
    "RecordType": "Delivery",
    "MessageID": "test-message-id-12345"
  }'

echo -e "\n\n"

# Test 5: Missing API Key (should fail)
echo "Test 5: Missing API Key (should return 401)"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "RecordType": "Delivery",
    "MessageID": "test-message-id-12345"
  }'

echo -e "\n\n"
echo "Tests completed!"
