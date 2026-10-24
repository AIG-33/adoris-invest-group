export const EMAIL_STATUS: Record<string, { label: string; className: string }> = {
  new: { label: 'В очереди', className: 'bg-neutral-100 text-neutral-700' },
  processing: { label: 'Обработка', className: 'bg-blue-50 text-blue-700' },
  ignored: { label: 'Пропущено', className: 'bg-neutral-100 text-neutral-500' },
  not_rfq: { label: 'Не запрос цен', className: 'bg-neutral-100 text-neutral-600' },
  rfq_detected: { label: 'Запрос (мониторинг)', className: 'bg-indigo-50 text-indigo-700' },
  draft_ready: { label: 'Черновик на проверке', className: 'bg-amber-50 text-amber-800' },
  sent_auto: { label: 'Отправлено · авто', className: 'bg-green-50 text-green-700' },
  sent_manual: { label: 'Отправлено · вручную', className: 'bg-emerald-50 text-emerald-800' },
  rejected: { label: 'Отклонено', className: 'bg-neutral-100 text-neutral-600' },
  error: { label: 'Ошибка', className: 'bg-red-50 text-red-700' },
}

export const MAILBOX_MODES: { value: string; label: string; hint: string }[] = [
  { value: 'off', label: 'Выключен', hint: 'Ящик не обрабатывается' },
  { value: 'monitor', label: 'Только мониторинг', hint: 'Письма распознаются, ответы не готовятся' },
  { value: 'drafts', label: 'Черновики', hint: 'Готовится ответ, менеджер отправляет вручную' },
  { value: 'auto', label: 'Автоотправка', hint: 'Ответ уходит сам, если включён общий переключатель и выполнены правила' },
]

export const ITEM_STATUS: Record<string, { label: string; className: string }> = {
  found: { label: 'Найден', className: 'text-green-700' },
  no_price: { label: 'Без цены', className: 'text-amber-700' },
  not_found: { label: 'Не найден', className: 'text-red-700' },
}

export const LOG_ACTIONS: Record<string, string> = {
  auto_send_enabled: 'Автоотправка включена',
  auto_send_disabled: 'Автоотправка выключена',
  model_changed: 'Изменена модель AI',
  threshold_changed: 'Изменён порог уверенности',
  mailbox_connected: 'Подключён ящик',
  mailbox_disconnected: 'Отключён ящик',
  mailbox_mode_changed: 'Изменён режим ящика',
  prompt_saved: 'Сохранён промт',
  prompt_activated: 'Активирована версия промта',
  template_saved: 'Сохранён шаблон',
  template_deleted: 'Удалён шаблон',
  reply_sent_auto: 'Ответ отправлен автоматически',
  reply_sent_manual: 'Ответ отправлен вручную',
  email_reprocessed: 'Письмо обработано заново',
  email_not_rfq: 'Отмечено «не запрос цен»',
  email_rejected: 'Письмо отклонено',
  email_forced_rfq: 'Вручную отмечено как запрос цен',
}
