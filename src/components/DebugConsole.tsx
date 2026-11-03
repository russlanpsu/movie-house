// DebugConsole.tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Hook, Console, Decode, Unhook } from 'console-feed';

export function DebugConsole() {
  const [searchParams] = useSearchParams();
  const isDebug = searchParams.get('debug') === '1';
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // Если отладка выключена, ничего не делаем
    if (!isDebug) return;

    // Перехватываем консоль
    const hookedConsole = Hook(
      window.console,
      (log) => setLogs((currLogs) => [...currLogs, Decode(log)]),
      // false // отключаем сериализацию для производительности
    );

    // Очистка при размонтировании или выключении отладки
    return () => {
      Unhook(hookedConsole);
      setLogs([]); // Очищаем логи при выходе
    };
  }, [isDebug]);

  if (!isDebug) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '40vh',
      backgroundColor: '#242424',
      zIndex: 9999,
      overflow: 'auto'
    }}>
      <Console logs={logs} variant="dark" />
    </div>
  );
}