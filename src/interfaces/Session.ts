interface Session {
  id: string;
  bpm: number;
  pitch_margin: number;
  threshold: number;
  tab_key: string;
  last_seen: string;
  is_playing: boolean;
}
