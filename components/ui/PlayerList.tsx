'use client';

import { Badge } from './Badge';
import { useLanguage } from '@/lib/i18n';

interface PlayerListProps {
  players: Record<string, { ready: boolean; turn: number }>;
  host: string;
  myName: string;
}

export function PlayerList({ players, host, myName }: PlayerListProps) {
  const { t } = useLanguage();
  const playerNames = Object.keys(players);

  return (
    <div>
      {playerNames.map((name) => {
        const player = players[name];
        return (
          <div key={name} className="flex items-center gap-[10px] py-1">
            <span className="font-body text-text text-sm">{name}</span>
            <div className="flex items-center gap-1">
              {name === myName && <Badge variant="you">{t('badgeYou')}</Badge>}
              {name === host && <Badge variant="host">{t('badgeHost')}</Badge>}
              {player.ready
                ? <Badge variant="ready">{t('badgeReady')}</Badge>
                : <Badge variant="waiting">{t('badgeWaiting')}</Badge>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}
