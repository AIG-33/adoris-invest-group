# Email Deliverability Guide

## Проблема: Письма попадают в спам

Чтобы улучшить доставляемость писем и избежать попадания в спам, необходимо настроить SPF, DKIM и DMARC записи в DNS.

## Настройка DNS записей

### 1. SPF (Sender Policy Framework)

Добавьте TXT запись в DNS вашего домена:

```
Type: TXT
Name: @ (или ваш домен, например adorisgroup.com)
Value: v=spf1 include:_spf.google.com ~all
```

Если используете другой SMTP сервер, замените `_spf.google.com` на соответствующий:
- Для Gmail: `include:_spf.google.com`
- Для SendGrid: `include:sendgrid.net`
- Для Mailgun: `include:mailgun.org`
- Для AWS SES: `include:amazonses.com`

### 2. DKIM (DomainKeys Identified Mail)

DKIM записи обычно предоставляются вашим email провайдером. Например:

**Для Gmail:**
1. Зайдите в Google Workspace Admin Console
2. Apps > Google Workspace > Gmail
3. Authenticate email > Generate new record
4. Добавьте полученную TXT запись в DNS

**Для SendGrid:**
1. Settings > Sender Authentication
2. Domain Authentication
3. Добавьте полученные CNAME записи в DNS

### 3. DMARC (Domain-based Message Authentication)

Добавьте TXT запись:

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com; ruf=mailto:dmarc@yourdomain.com; pct=100
```

Начните с `p=quarantine` (карантин), затем через неделю измените на `p=reject` (отклонение).

### 4. Проверка настроек

Используйте онлайн инструменты для проверки:
- https://mxtoolbox.com/spf.aspx
- https://mxtoolbox.com/dkim.aspx
- https://mxtoolbox.com/dmarc.aspx
- https://www.mail-tester.com/ - отправьте тестовое письмо и получите оценку

## Дополнительные улучшения

### В коде уже реализовано:
✅ Текстовая версия писем (text + html)
✅ Правильные заголовки (Message-ID, List-Unsubscribe)
✅ Убраны эмодзи из темы письма
✅ Добавлен replyTo заголовок
✅ Улучшена структура письма

### Рекомендации:

1. **Используйте доменный email** (например, `noreply@adorisgroup.com` вместо Gmail)
2. **Настройте обратный DNS (rDNS)** для вашего SMTP сервера
3. **Избегайте спам-триггеров:**
   - Не используйте слова типа "FREE", "URGENT", "CLICK HERE" в теме
   - Не используйте только заглавные буквы
   - Избегайте множественных восклицательных знаков
   - Не используйте сокращенные URL (bit.ly и т.д.)

4. **Постепенно увеличивайте объем:**
   - Начните с малого количества писем
   - Постепенно увеличивайте объем
   - Мониторьте репутацию отправителя

5. **Используйте специализированные сервисы:**
   - SendGrid
   - Mailgun
   - AWS SES
   - Postmark
   - Mailchimp Transactional

## Проверка текущих настроек

Выполните команды для проверки:

```bash
# Проверка SPF
dig TXT adorisgroup.com | grep spf

# Проверка DKIM
dig TXT default._domainkey.adorisgroup.com

# Проверка DMARC
dig TXT _dmarc.adorisgroup.com
```

## Контакты для помощи

Если письма все еще попадают в спам после настройки DNS:
1. Проверьте настройки через mail-tester.com
2. Проверьте репутацию IP адреса SMTP сервера
3. Убедитесь, что домен не в черных списках
4. Рассмотрите использование специализированного email сервиса

