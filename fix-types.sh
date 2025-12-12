#!/bin/bash
# Fix Exhibition date references
sed -i "s/orderBy: { date: 'desc' }/orderBy: { startDate: 'desc' }/g" app/exhibitions/page.tsx
sed -i "s/exhibition.date/exhibition.startDate/g" app/exhibitions/\[id\]/page.tsx

echo "✅ TypeScript fixes applied"
