#!/bin/bash

# Скрипт для тестирования API приложения Shopping Optimizer

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000/api"

echo -e "${BLUE}===== Тестирование API Shopping Optimizer =====${NC}"
echo "Базовый URL: $BASE_URL"
echo ""

# Проверка статуса API
echo -e "${BLUE}1. Проверка статуса API${NC}"
STATUS_RESPONSE=$(curl -s "$BASE_URL/status")

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ API доступен${NC}"
    echo -e "${YELLOW}Ответ API:${NC}"
    echo "$STATUS_RESPONSE" | json_pp
else
    echo -e "${RED}✗ API недоступен${NC}"
fi
echo ""

# Проверка API магазинов
echo -e "${BLUE}2. Получение списка магазинов${NC}"
STORES_RESPONSE=$(curl -s "$BASE_URL/stores")

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ API магазинов работает${NC}"
    echo -e "${YELLOW}Ответ API:${NC}"
    echo "$STORES_RESPONSE" | json_pp
else
    echo -e "${RED}✗ Ошибка при запросе к API магазинов${NC}"
fi
echo ""

# Тестирование обработки списка покупок
echo -e "${BLUE}3. Тестирование обработки списка покупок${NC}"

TEST_LIST="молоко
хлеб
яблоки
сыр
курица
макароны
помидоры"

echo -e "${YELLOW}Тестовый список:${NC}"
echo "$TEST_LIST"
echo ""

SHOPPING_LIST_RESPONSE=$(curl -s -X POST "$BASE_URL/shopping-list" \
  -H "Content-Type: application/json" \
  -d "{\"rawText\":\"$TEST_LIST\",\"userId\":\"test-user\",\"listName\":\"Test List\"}")

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ API обработки списка покупок работает${NC}"
    echo -e "${YELLOW}Ответ API:${NC}"
    echo "$SHOPPING_LIST_RESPONSE" | json_pp
    
    # Проверка, использовался ли AI для обработки
    if echo "$SHOPPING_LIST_RESPONSE" | grep -q "ai"; then
        echo -e "${GREEN}✓ AI используется для обработки списка${NC}"
    else
        echo -e "${YELLOW}⚠ AI не используется для обработки списка${NC}"
    fi
else
    echo -e "${RED}✗ Ошибка при обработке списка покупок${NC}"
fi
echo ""

echo -e "${BLUE}===== Тестирование завершено =====${NC}"
